import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PDFReaderService, type PDFDocumentProxy } from "@/services/pdfReaderService";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
  BookOpen,
  Volume2,
  Square,
} from "lucide-react";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.2, 1.5, 2, 2.5, 3];
const SPEECH_RATES = [0.75, 1.0, 1.25, 1.5] as const;
// Máximo de páginas vazias puladas em sequência antes de pausar.
const MAX_PULOS_PAGINA_VAZIA = 5;

interface CachedLayout {
  fullText: string;
  orderedSpans: HTMLElement[];
}

interface PdfReaderProps {
  url?: string;
  className?: string;
  /** Nome do livro: aparece minúsculo sob a pílula flutuante (não ocupa layout). */
  title?: string;
}

export function PdfReader({ url, title, className = "" }: PdfReaderProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [pageInput, setPageInput] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const layoutCache = useRef<{ [key: string]: CachedLayout }>({});

  // Leitura contínua: sessão atual (invalida eventos onend/onerror de
  // falas canceladas/substituídas), pedido de retomada após renderizar
  // a página e sequência de render (descarta retomadas obsoletas).
  const sessaoLeituraRef = useRef(0);
  const autoReadRef = useRef(false);
  const renderSeqRef = useRef(0);
  const paginasVaziasRef = useRef(0);
  // Zoom que preenche a largura (calculado ao abrir o PDF; o % reseta p/ ele).
  const fitScaleRef = useRef(1);
  const didFitRef = useRef(false);
  const startReadingRef = useRef<() => void>(() => {});

  const highlightCurrentElement = (activeSpan: HTMLElement | null) => {
    // 1. Limpa o destaque de TODOS os spans da camada de texto
    if (textLayerRef.current) {
      textLayerRef.current.querySelectorAll('.pdf-text-span').forEach((el) => {
        el.classList.remove('reading-highlight');
      });
    }

    // 2. Aplica a classe de destaque APENAS no span atual
    if (activeSpan) {
      activeSpan.classList.add('reading-highlight');
    }
  };

  const cancelSpeech = useCallback(() => {
    // Invalida a sessão ANTES de cancelar: o cancel pode disparar
    // onend/onerror residual — já chega morto e não avança a página.
    sessaoLeituraRef.current += 1;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsReading(false);
    // Clear highlights
    highlightCurrentElement(null);
  }, []);

  // Detecta se o PDF tem layout de 2 colunas ou 1 coluna e ordena de cima para baixo
  const getOrderedNodes = (textLayer: HTMLElement) => {
    const spans = Array.from(textLayer.querySelectorAll('span')) as HTMLElement[];
    if (!spans.length) return [];

    const containerWidth = textLayer.offsetWidth;
    const middleX = containerWidth / 2;

    // Ler top/left DIRETO do CSS inline (mais confiável que offsetTop ou getBoundingClientRect)
    const items = spans.map(span => {
      const text = span.innerText ? span.innerText.trim() : '';
      const topVal = parseFloat(span.style.top) || 0;
      const leftVal = parseFloat(span.style.left) || 0;
      return {
        element: span,
        text,
        top: topVal,
        left: leftVal,
        centerX: leftVal + (span.offsetWidth || 0) / 2,
      };
    }).filter(item => item.text.length > 0);

    if (items.length === 0) return [];

    // Detectar se é 2 colunas
    const margin = containerWidth * 0.1;
    const leftItems = items.filter(i => i.centerX < middleX - margin);
    const rightItems = items.filter(i => i.centerX > middleX + margin);
    const centerItems = items.filter(i => i.centerX >= middleX - margin && i.centerX <= middleX + margin);

    const isTwoColumns = rightItems.length > 0 && leftItems.length > 0 && centerItems.length < 3;

    const sortByTop = (a: typeof items[0], b: typeof items[0]) => {
      if (Math.abs(a.top - b.top) <= 5) {
        return a.left - b.left;
      }
      return a.top - b.top;
    };

    if (!isTwoColumns) {
      items.sort(sortByTop);
      return items.map(i => i.element);
    }

    leftItems.sort(sortByTop);
    rightItems.sort(sortByTop);

    return [...leftItems, ...rightItems].map(i => i.element);
  };

  // Motor de Análise Visual e Agrupamento por Colunas/Regiões
  const analyzeAndBuildReadingOrder = (
    textLayerEl: HTMLElement,
    _readingDirection: 'TOP_TO_BOTTOM' | 'BOTTOM_TO_TOP' = 'TOP_TO_BOTTOM'
  ): CachedLayout => {
    const textLayer = textLayerEl;
    const spans = Array.from(textLayer.querySelectorAll('.pdf-text-span')) as HTMLElement[];
    const validSpans = spans.filter(s => s.innerText && s.innerText.trim().length > 0);

    if (validSpans.length === 0) return { fullText: '', orderedSpans: [] };

    const orderedSpans = getOrderedNodes(textLayer);

    const fullText = orderedSpans.length > 0 ? 
      orderedSpans.map(s => s.innerText.trim()).join(' ') : '';

    return { fullText, orderedSpans };
  };

  const startReading = (readingDirection: 'TOP_TO_BOTTOM' | 'BOTTOM_TO_TOP' = 'TOP_TO_BOTTOM') => {
    // Nova sessão de leitura: invalida eventos de falas anteriores.
    const sessao = ++sessaoLeituraRef.current;

    const textLayerEl = textLayerRef.current;
    if (!textLayerEl) return;

    const cacheKey = `${currentPage}_${readingDirection}`;
    let layout = layoutCache.current[cacheKey];

    // Se não existir no Cache, faz a análise e salva
    if (!layout) {
      layout = analyzeAndBuildReadingOrder(textLayerEl, readingDirection);
      layoutCache.current[cacheKey] = layout;
    }

    // Página em branco (sem texto, ou só número/cabeçalho): pula sozinha
    // após uma pausa curta, para o usuário perceber a virada.
    if (!layout.fullText || layout.fullText.trim().length < 3) {
        window.speechSynthesis.cancel();
        if (textLayerRef.current) {
          const spans = textLayerRef.current.querySelectorAll('span');
          spans.forEach(s => s.style.color = 'transparent');
        }
        if (currentPage < numPages && paginasVaziasRef.current < MAX_PULOS_PAGINA_VAZIA) {
          paginasVaziasRef.current += 1;
          if (paginasVaziasRef.current === 1) {
            toast.info(`Página ${currentPage} sem texto para ler — avançando...`);
          }
          // Mantém o estado "lendo" (o Parar continua valendo) e vira a
          // página após 800ms.
          setIsReading(true);
          autoReadRef.current = true;
          setTimeout(() => {
            if (sessaoLeituraRef.current === sessao) {
              setPageInput("");
              setCurrentPage(currentPage + 1);
            }
          }, 800);
        } else {
          paginasVaziasRef.current = 0;
          stopReading();
          if (currentPage < numPages) {
            toast.warning("Várias páginas sem texto — leitura pausada.");
          }
        }
        return;
      }
      // Página com conteúdo: zera o contador de pulos em sequência.
      paginasVaziasRef.current = 0;

    // Cancela áudios anteriores
    window.speechSynthesis.cancel();
    setIsReading(true);

    // Destaca APENAS o span inicial (frase atual em leitura)
    if (layout.orderedSpans[0]) {
      highlightCurrentElement(layout.orderedSpans[0]);
    }

    // Auto-scroll para o início do conteúdo lido
    if (layout.orderedSpans[0]) {
      layout.orderedSpans[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const utterance = new SpeechSynthesisUtterance(layout.fullText);
    utterance.lang = 'pt-BR';
    utterance.rate = speechRate;

    // Fim NATURAL da página (mesma sessão): vira a página sozinho e a
    // retomada acontece ao concluir a renderização (ver renderPage).
    // Eventos de sessões antigas (canceladas/substituídas) são ignorados.
    utterance.onend = () => {
      if (sessaoLeituraRef.current !== sessao) return;
      if (currentPage < numPages) {
        autoReadRef.current = true;
        setPageInput("");
        setCurrentPage(currentPage + 1);
      } else {
        stopReading();
      }
    };
    utterance.onerror = () => {
      if (sessaoLeituraRef.current !== sessao) return;
      stopReading();
    };

    setTimeout(() => {
      // Só fala se esta sessão continuar válida (o usuário pode ter
      // apertado Parar ou trocado de página durante a espera).
      if (sessaoLeituraRef.current === sessao) {
        window.speechSynthesis.speak(utterance);
      }
    }, 100);
  };

const stopReading = () => {
    // Invalida a sessão ANTES de cancelar (o cancel pode disparar
    // onend/onerror residual — já chega morto e não avança a página).
    sessaoLeituraRef.current += 1;
    // Parada total também cancela retomada pendente (pulo de página vazia).
    autoReadRef.current = false;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);

    // Remove highlight de todos os spans
    if (textLayerRef.current) {
      const spans = textLayerRef.current.querySelectorAll(".pdf-text-span");
      spans.forEach(s => s.classList.remove('reading-highlight'));
    }
  };

  const toggleReading = useCallback(() => {
    if (isReading) {
      stopReading();
    } else if (pdfDoc) {
      startReading();
    }
  }, [isReading, startReading, pdfDoc]);

  // Espelho da última versão de startReading para uso dentro de
  // callbacks estáveis (retomada após renderizar a nova página).
  startReadingRef.current = startReading;

  const renderPage = useCallback(
    async (doc: PDFDocumentProxy, page: number, s: number) => {
      const canvas = canvasRef.current;
      if (!doc || !canvas) return;

      // Cancel any pending render task before starting a new one
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      try {
        const renderTask = await PDFReaderService.renderPageToCanvas(doc, page, canvas, s);
        renderTaskRef.current = renderTask;
        await renderTask.promise;

// Render text layer
          if (textLayerRef.current) {
            const pageObj = await doc.getPage(page);
            const textContent = await pageObj.getTextContent();
            const viewport = pageObj.getViewport({ scale: s });
            
            // Clear previous text layer
            textLayerRef.current.innerHTML = "";
            textLayerRef.current.style.width = `${viewport.width}px`;
            textLayerRef.current.style.height = `${viewport.height}px`;

            // Create text layer using pdfjs-dist approach
            // Using span elements for better text extraction and column detection
            textContent.items.forEach((item: any) => {
              const span = document.createElement("span");
              span.className = "pdf-text-span";
              span.textContent = item.str;
              span.style.position = "absolute";
              // PDF.js transform[5] mede do RODAPÉ (bottom). CSS top mede do TOPO.
              // Inverter: top = viewport.height - transform[5]
              span.style.left = `${item.transform[4]}px`;
              span.style.top = `${viewport.height - item.transform[5]}px`;
              span.style.fontSize = `${item.transform[0] * s}px`;
              span.style.fontFamily = item.fontName || "sans-serif";
              span.style.whiteSpace = "nowrap";
              span.style.color = "transparent";
              span.style.userSelect = "none";
              span.style.display = "inline-block";
              textLayerRef.current?.appendChild(span);
            });
          }

          renderSeqRef.current += 1;
          // Retomada de leitura: terminou de montar a nova página e há
          // pedido pendente (avanço automático ou troca manual com áudio
          // ativo) — começa a narrar a nova página.
          if (autoReadRef.current) {
            autoReadRef.current = false;
            const sessao = sessaoLeituraRef.current;
            const seq = renderSeqRef.current;
            setTimeout(() => {
              // Só retoma se nada mais novo aconteceu (outra troca de
              // página ou Parar invalida a sessão/sequência).
              if (sessaoLeituraRef.current === sessao && renderSeqRef.current === seq) {
                startReadingRef.current();
              }
            }, 250);
          }
      } catch (error: any) {
        if (error?.name !== "RenderingCancelledException") {
          console.error("Erro ao renderizar página:", error);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (pdfDoc && currentPage >= 1 && currentPage <= numPages) {
      renderPage(pdfDoc, currentPage, scale);
    }
  }, [pdfDoc, currentPage, scale, numPages, renderPage]);

  // Cleanup render on unmount only
  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation errors
        }
        renderTaskRef.current = null;
      }
      cancelSpeech();
    };
  }, [cancelSpeech]);

  const loadFromUrl = async (fileUrl: string) => {
    cancelSpeech();
    autoReadRef.current = false;
    didFitRef.current = false;
    fitScaleRef.current = 1;
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setNumPages(0);
    setCurrentPage(1);
    setScale(1);
    try {
      const doc = await PDFReaderService.loadDocument(fileUrl);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setScale(1);
    } catch (err) {
      console.error("Erro ao carregar PDF:", err);
      setError("Não foi possível carregar o PDF. Verifique o arquivo e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      loadFromUrl(url);
    }
  }, [url]);

  // Zoom inicial: ajusta à largura disponível para o PDF preencher o
  // espaço (ler e ouvir ao mesmo tempo, sem faixa vazia nas laterais).
  useEffect(() => {
    if (!pdfDoc || didFitRef.current) return;
    didFitRef.current = true;
    (async () => {
      try {
        const pageObj = await pdfDoc.getPage(1);
        const v = pageObj.getViewport({ scale: 1 });
        const cw = containerRef.current?.clientWidth ?? 0;
        if (v.width > 0 && cw > 32) {
          const fit = Math.min(2, Math.max(0.5, (cw - 32) / v.width));
          fitScaleRef.current = fit;
          setScale(fit);
        }
      } catch {
        /* mantém 100% */
      }
    })();
  }, [pdfDoc]);

  useEffect(() => {
    return () => {
      if (pdfDoc && typeof pdfDoc === "object" && "destroy" in pdfDoc) {
        (pdfDoc as any).destroy?.();
      }
      cancelSpeech();
    };
  }, [pdfDoc, cancelSpeech]);

  // Troca de página: pausa a fala atual; se estava lendo, a leitura
  // recomeça sozinha na nova página (ver retomada em renderPage).
  const goToPage = (p: number) => {
    const estavaLendo = isReading;
    cancelSpeech();
    const n = Math.max(1, Math.min(numPages, p));
    if (n === currentPage) {
      if (estavaLendo) startReading();
      return;
    }
    autoReadRef.current = estavaLendo;
    setCurrentPage(n);
    setPageInput("");
  };

  const handlePageInputChange = (v: string) => {
    setPageInput(v);
    const n = parseInt(v, 10);
    if (!isNaN(n) && n >= 1 && n <= numPages) {
      goToPage(n);
    }
  };

  const zoomIn = () => {
    // Robusto a escalas intermediárias (ajuste à largura pode não cair num nível).
    const next = ZOOM_LEVELS.find((l) => l > scale + 1e-6);
    if (next !== undefined) setScale(next);
  };

  const zoomOut = () => {
    const prev = [...ZOOM_LEVELS].reverse().find((l) => l < scale - 1e-6);
    if (prev !== undefined) setScale(prev);
  };

  // Reset volta ao ajuste à largura (zoom inicial).
  const resetZoom = () => setScale(fitScaleRef.current);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Estado vazio/erro — o usuário NÃO envia arquivos aqui (o livro vem
          da Biblioteca, vinculado pelo admin). Este leitor só abre e narra. */}
      {!pdfDoc && !loading && (
        <div className="glass rounded-3xl p-12 text-center border border-border/30">
          {error ? (
            <div className="space-y-2">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground">
                Volte à Biblioteca e abra o livro novamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Nenhum livro aberto</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Abra um livro pela Biblioteca para ler e ouvir aqui.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando PDF...</p>
          </div>
        </div>
      )}

      {/* Reader */}
      {pdfDoc && !loading && (
        <>
          {/* Canvas area — SEM barra de topo: o PDF ocupa 100% da altura;
              todos os controles flutuam POR CIMA da página. */}
          <div className="flex-1 min-h-0 relative rounded-2xl glass">
            <div
              ref={containerRef}
              className="h-full overflow-auto p-4 flex flex-col items-center"
            >
              <div className="relative w-fit">
                <canvas
                  ref={canvasRef}
                  className="shadow-2xl rounded-sm"
                />
                <div
                  ref={textLayerRef}
                  className="absolute inset-0 pointer-events-none"
                  style={{ fontSize: "1px" }}
                />
              </div>
            </div>

            {/* Camada flutuante SOBRE o PDF: zoom + navegação + ouvir.
                Não ocupa espaço de layout e fica visível mesmo rolando a página. */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 max-w-[calc(100%-1rem)]">
              <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 py-1.5 shadow-xl backdrop-blur-md max-w-full">
              {/* Zoom — flutua sobre o PDF, não ocupa espaço de layout */}
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
                  disabled={scale <= ZOOM_LEVELS[0]}
                  onClick={zoomOut}
                  aria-label="Diminuir zoom"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  onClick={resetZoom}
                  title="Redefinir zoom"
                  className="w-10 text-center text-[11px] font-bold text-white/70 hover:text-white cursor-pointer"
                >
                  {Math.round(scale * 100)}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
                  disabled={scale >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                  onClick={zoomIn}
                  aria-label="Aumentar zoom"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-px h-5 bg-white/15 mx-1" />

              {/* Navegação de página — colada no Ouvir/Parar */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-xs font-semibold">
                <input
                  type="text"
                  inputMode="numeric"
                  value={pageInput || currentPage}
                  onChange={(e) => handlePageInputChange(e.target.value)}
                  onBlur={() => setPageInput("")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const n = parseInt(pageInput || "0", 10);
                      if (!isNaN(n)) goToPage(n);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="w-9 text-center bg-white/10 border border-white/15 rounded-md px-1 py-0.5 text-xs font-bold text-white outline-none focus:border-white/40"
                />
                <span className="text-white/60">/</span>
                <span className="text-white/60">{numPages}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
                disabled={currentPage >= numPages}
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Ouvir / Parar leitura em voz alta */}
              <Button
                variant="ghost"
                size="sm"
                className={
                  isReading
                    ? "h-8 gap-1.5 px-3 text-xs font-bold rounded-full bg-red-500/85 text-white hover:bg-red-500 hover:text-white"
                    : "h-8 gap-1.5 px-3 text-xs font-bold rounded-full bg-white text-black hover:bg-white/90 hover:text-black"
                }
                onClick={toggleReading}
                aria-label={isReading ? "Parar leitura" : "Iniciar leitura"}
              >
                {isReading ? (
                  <Square className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
                {isReading ? "Parar" : "Ouvir"}
              </Button>

              {/* Velocidade da voz */}
              <select
                value={speechRate}
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value);
                  setSpeechRate(newRate);
                  if (isReading) {
                    stopReading();
                    setTimeout(() => startReading(), 100);
                  }
                }}
                className="h-8 px-1.5 rounded-md bg-white/10 border border-white/15 text-xs font-semibold text-white outline-none focus:border-white/40 cursor-pointer"
                aria-label="Velocidade da voz"
              >
                {SPEECH_RATES.map((rate) => (
                  <option key={rate} value={rate} className="bg-white text-black">
                    {rate}x
                  </option>
                ))}
              </select>
              </div>
              {title && (
                <p className="text-[10px] font-medium text-white/50 bg-black/50 rounded-full px-2.5 py-0.5 backdrop-blur-sm truncate max-w-full">
                  {title}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}