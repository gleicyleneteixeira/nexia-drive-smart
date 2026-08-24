import { useCallback, useEffect, useRef, useState } from "react";
import { PDFReaderService, type PDFDocumentProxy } from "@/services/pdfReaderService";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  Loader2,
  AlertCircle,
  BookOpen,
  Volume2,
  VolumeX,
} from "lucide-react";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.2, 1.5, 2, 2.5, 3];

interface CachedLayout {
  fullText: string;
  orderedSpans: HTMLElement[];
}

interface PdfReaderProps {
  url?: string;
  className?: string;
}

export function PdfReader({ url, className = "" }: PdfReaderProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(2.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const renderTaskRef = useRef<any>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [pageInput, setPageInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const layoutCache = useRef<{ [key: string]: CachedLayout }>({});

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsReading(false);
    // Clear highlights
    if (textLayerRef.current) {
      textLayerRef.current.querySelectorAll(".pdf-text-highlight").forEach((el) => {
        el.classList.remove("pdf-text-highlight");
      });
    }
  }, []);

  // Motor de Análise Visual e Agrupamento por Colunas/Regiões
  const analyzeAndBuildReadingOrder = (
    textLayerEl: HTMLElement,
    readingDirection: 'TOP_TO_BOTTOM' | 'BOTTOM_TO_TOP' = 'TOP_TO_BOTTOM'
  ): CachedLayout => {
    const spans = Array.from(textLayerEl.querySelectorAll('span')) as HTMLElement[];
    const validSpans = spans.filter(s => s.innerText && s.innerText.trim().length > 0);

    if (validSpans.length === 0) return { fullText: '', orderedSpans: [] };

    const containerRect = textLayerEl.getBoundingClientRect();
    const pageHeight = containerRect.height;
    const pageWidth = containerRect.width;

    // 1. Mapear cada elemento com suas coordenadas e definir Páginas Lógicas (Superior vs Inferior)
    const items = validSpans.map((span, index) => {
      const rect = span.getBoundingClientRect();
      const relY = rect.top - containerRect.top;
      const relX = rect.left - containerRect.left;

      return {
        id: `span-${index}`,
        span,
        rect,
        relX,
        relY,
        text: span.innerText.trim(),
        // Divide a página física em 2 regiões se houver quebra horizontal (Página Lógica A / B)
        regionIndex: relY < pageHeight * 0.48 ? 0 : 1
      };
    });

    let finalOrderedItems: typeof items = [];
    const regions = [0, 1]; // Região Superior (0) -> Região Inferior (1)

    regions.forEach(regionId => {
      const regionItems = items.filter(item => item.regionIndex === regionId);
      if (regionItems.length === 0) return;

      // Detectar Colunas dentro da mesma Região (Eixo X)
      const midX = pageWidth / 2;
      const leftColumn = regionItems.filter(item => item.relX < midX);
      const rightColumn = regionItems.filter(item => item.relX >= midX);

      // Função de ordenação vertical dentro de uma coluna isolada
      const sortVertical = (colItems: typeof items) => {
        return colItems.sort((a, b) => {
          // Se estiverem na mesma linha (diferença Y <= 8px), ordena da esquerda para direita
          if (Math.abs(a.relY - b.relY) <= 8) {
            return a.relX - b.relX;
          }
          // Aplica o sentido de leitura configurado (Cima -> Baixo ou Baixo -> Cima)
          return readingDirection === 'TOP_TO_BOTTOM' 
            ? a.relY - b.relY 
            : b.relY - a.relY;
        });
      };

      const orderedLeft = sortVertical(leftColumn);
      const orderedRight = sortVertical(rightColumn);

      // Se houver 2 colunas distintas na região, lê toda a Esquerda e depois toda a Direita
      if (orderedLeft.length > 0 && orderedRight.length > 0) {
        finalOrderedItems.push(...orderedLeft, ...orderedRight);
      } else {
        finalOrderedItems.push(...sortVertical(regionItems));
      }
    });

    const orderedSpans = finalOrderedItems.map(i => i.span);
    const fullText = finalOrderedItems.map(i => i.text).join(' ');

    return { fullText, orderedSpans };
  };

  const startReading = (readingDirection: 'TOP_TO_BOTTOM' | 'BOTTOM_TO_TOP' = 'TOP_TO_BOTTOM') => {
    const textLayerEl = textLayerRef.current;
    if (!textLayerEl) return;

    const cacheKey = `${currentPage}_${readingDirection}`;
    let layout = layoutCache.current[cacheKey];

    // Se não existir no Cache, faz a análise e salva
    if (!layout) {
      layout = analyzeAndBuildReadingOrder(textLayerEl, readingDirection);
      layoutCache.current[cacheKey] = layout;
    }

    if (!layout.fullText) {
        // Fallback: tentar extrair do PDF.js (note: startReading não é async,
        // então apenas registramos e solicitamos nova análise na próxima vez)
        console.log("Texto vazio - análise agendada para próxima interação");
        setIsReading(false);
        if (textLayerRef.current) {
          const spans = textLayerRef.current.querySelectorAll('span');
          spans.forEach(s => s.style.color = 'transparent');
        }
        // Pequena pausa para o usuário perceber o attempt
        setTimeout(() => {}, 50);
        return;
      }

    // Cancela áudios anteriores
    window.speechSynthesis.cancel();
    setIsReading(true);

    // Aplica highlight amarelo nos elementos ordenados
    layout.orderedSpans.forEach(s => s.classList.add('bg-yellow-200', 'text-black'));

    // Auto-scroll para o início do conteúdo lido
    if (layout.orderedSpans[0]) {
      layout.orderedSpans[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const utterance = new SpeechSynthesisUtterance(layout.fullText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onend = () => stopReading();
    utterance.onerror = () => stopReading();

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

const stopReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);

    if (textLayerRef.current) {
      const spans = textLayerRef.current.querySelectorAll("span");
      spans.forEach(s => s.classList.remove("bg-yellow-200", "text-black"));
    }
  };

  const toggleReading = useCallback(() => {
    if (isReading) {
      stopReading();
    } else if (pdfDoc) {
      startReading();
    }
  }, [isReading, startReading, pdfDoc]);

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
          textContent.items.forEach((item: any) => {
            const div = document.createElement("div");
            div.className = "pdf-text-item";
            div.textContent = item.str;
            div.style.position = "absolute";
            div.style.left = `${item.transform[4]}px`;
            div.style.top = `${item.transform[5]}px`;
            div.style.fontSize = `${item.transform[0] * s}px`;
            div.style.fontFamily = item.fontName || "sans-serif";
            div.style.whiteSpace = "pre";
            div.style.color = "transparent";
            div.style.userSelect = "none";
            textLayerRef.current?.appendChild(div);
          });
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

  // Cleanup: cancel any ongoing render and speech when dependencies change or component unmounts
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
  }, [currentPage, scale, pdfDoc, cancelSpeech]);

  const loadFromUrl = async (fileUrl: string, name?: string) => {
    cancelSpeech();
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setNumPages(0);
    setCurrentPage(1);
    setScale(2.5);
    setFileName(name ?? null);
    try {
      const doc = await PDFReaderService.loadDocument(fileUrl);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setScale(2.5);
    } catch (err) {
      console.error("Erro ao carregar PDF:", err);
      setError("Não foi possível carregar o PDF. Verifique o arquivo e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Selecione um arquivo PDF válido.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    await loadFromUrl(objectUrl, file.name);
  };

  useEffect(() => {
    if (url) {
      loadFromUrl(url);
    }
  }, [url]);

  useEffect(() => {
    return () => {
      if (pdfDoc && typeof pdfDoc === "object" && "destroy" in pdfDoc) {
        (pdfDoc as any).destroy?.();
      }
      cancelSpeech();
    };
  }, [pdfDoc, cancelSpeech]);

  const goToPage = (p: number) => {
    cancelSpeech();
    const n = Math.max(1, Math.min(numPages, p));
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
    const idx = ZOOM_LEVELS.indexOf(scale);
    if (idx < ZOOM_LEVELS.length - 1) setScale(ZOOM_LEVELS[idx + 1]);
  };

  const zoomOut = () => {
    const idx = ZOOM_LEVELS.indexOf(scale);
    if (idx > 0) setScale(ZOOM_LEVELS[idx - 1]);
  };

  const resetZoom = () => setScale(2.5);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Upload when no PDF loaded */}
      {!pdfDoc && !loading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            if (file && file.type === "application/pdf") {
              const objectUrl = URL.createObjectURL(file);
              loadFromUrl(objectUrl, file.name);
            }
          }}
          className="glass rounded-3xl p-12 text-center cursor-pointer hover:border-primary/50 transition-all border-2 border-dashed border-border/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {error ? (
            <div className="space-y-3">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  fileInputRef.current?.click();
                }}
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Abrir um livro PDF</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Arraste um arquivo aqui ou clique para selecionar
                </p>
              </div>
              <p className="text-xs text-muted-foreground/60">
                PDFs são processados inteiramente no seu navegador — sem envio ao servidor.
              </p>
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
          {/* Toolbar */}
          <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 mb-4 flex-wrap">
            {/* Left: file info + upload new */}
            <div className="flex items-center gap-3 min-w-0">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-muted-foreground truncate max-w-[180px] md:max-w-xs">
                {fileName ?? "PDF"}
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] text-primary hover:text-primary-glow font-semibold shrink-0 cursor-pointer"
              >
                Trocar arquivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Center: page navigation + TTS */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
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
                  className="w-10 text-center bg-background/50 border border-border/20 rounded-lg px-1 py-1 text-xs font-bold outline-none focus:border-primary/50"
                />
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{numPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= numPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* TTS Button */}
              <Button
                variant={isReading ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={toggleReading}
                aria-label={isReading ? "Parar leitura" : "Iniciar leitura"}
              >
                {isReading ? (
                  <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Right: zoom controls */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={scale <= ZOOM_LEVELS[0]}
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-bold text-muted-foreground w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={scale >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={resetZoom}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Canvas area with TextLayer overlay */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto rounded-2xl glass p-4 flex flex-col items-center relative"
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

          {/* Bottom navigation bar (mobile-friendly) */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= numPages}
              onClick={() => goToPage(currentPage + 1)}
              className="gap-1.5"
            >
              Próxima <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}