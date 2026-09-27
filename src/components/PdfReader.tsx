"use client";

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
  /** Página inicial (ex.: meta do cronograma). Padrão: 1. */
  initialPage?: number;
  /** Tenta começar a narrar sozinho ao abrir (o usuário pode ter que tocar em Ouvir, conforme o navegador). */
  autoStart?: boolean;
}

export function PdfReader({ url, title, initialPage, autoStart, className = "" }: PdfReaderProps) {
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
  // Espelho da velocidade: speakChunk roda dentro do closure antigo da
  // página (recursão onend), então lê daqui para valer a troca em tempo real.
  const speechRateRef = useRef(1.0);
  speechRateRef.current = speechRate;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const layoutCache = useRef<{ [key: string]: CachedLayout }>({});

  // Leitura contínua: sessão atual (invalida eventos onend/onerror de
  // falas canceladas/substituídas), pedido de retomada após renderizar
  // a página e sequência de render (descarta retomadas obsoletas).
  const sessaoLeituraRef = useRef(0);
  const autoReadRef = useRef(false);
  const renderSeqRef = useRef(0);
  const paginasVaziasRef = useRef(0);
  // Zoom que encaixa a página na tela (calculado ao abrir; o % reseta p/ ele).
  const fitScaleRef = useRef(1);
  const didFitRef = useRef(false);
  // true quando o usuário mexeu no zoom — aí o ajuste automático sai da frente.
  const zoomManualRef = useRef(false);
  const aplicarFitRef = useRef<() => Promise<void>>(async () => {});
  // Abertura dirigida (cronograma): posiciona na página uma única vez por PDF.
  const didInitRef = useRef(false);
  const autoStartRef = useRef(false);
  const startReadingRef = useRef<() => void>(() => {});
  // --- iOS/Safari: fala em blocos curtos + vigilância de eventos perdidos ---
  // O iPhone corta utterances longos e às vezes "engole" o onend/onerror.
  const chunksRef = useRef<string[]>([]);
  const chunkIdxRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);
  const keepAliveRef = useRef<number | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  // true = leitura iniciada por um toque do usuário (gesto válido no iOS);
  // false = retomada automática entre páginas (pode ser bloqueada pelo Safari).
  const gestoRef = useRef(true);

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

  // ====== Suporte a iPhone/iOS (Safari) =====================================
  // Limpa todos os timers de fala (vigias de início/fim e keep-alive).
  const clearSpeechTimers = () => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    if (startTimerRef.current !== null) {
      window.clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
    if (keepAliveRef.current !== null) {
      window.clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  // Escolhe uma voz pt-BR (o iPhone só tem vozes instaladas do sistema).
  const pickVoice = (): SpeechSynthesisVoice | null => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return null;
    const voices = synth.getVoices() || [];
    if (!voices.length) return voiceRef.current;
    const pt = voices.filter((v) => /^pt/i.test(v.lang || ""));
    const br =
      pt.find((v) => /^pt[-_]BR$/i.test(v.lang || "")) ||
      pt.find((v) => /brasil|brazil/i.test(v.name || "")) ||
      pt[0] ||
      voices.find((v) => v.default) ||
      voices[0];
    voiceRef.current = br;
    return br;
  };

  // O Safari iOS corta utterances longos: quebra em blocos de ~180 chars,
  // preferindo cortar em fim de frase/palavra.
  const splitForSpeech = (texto: string): string[] => {
    const limpo = texto.replace(/\s+/g, " ").trim();
    if (!limpo) return [];
    const frases = limpo.match(/[^.!?;:]+[.!?;:]?/g) || [limpo];
    const blocos: string[] = [];
    let atual = "";
    const guardar = (v: string) => {
      const t = v.trim();
      if (t) blocos.push(t);
    };
    for (const f of frases) {
      const p = f.trim();
      if (!p) continue;
      if (!atual) atual = p;
      else if (atual.length + p.length + 1 <= 180) atual += " " + p;
      else {
        guardar(atual);
        atual = p;
      }
      // Frase gigante: quebra por palavra
      while (atual.length > 180) {
        const corte = atual.lastIndexOf(" ", 180);
        const i = corte > 40 ? corte : 180;
        guardar(atual.slice(0, i));
        atual = atual.slice(i).trim();
      }
    }
    guardar(atual);
    return blocos;
  };

  // Evita que o SafariiOS suspenda a fala longa (chamado em intervalo).
  const startKeepAlive = () => {
    if (keepAliveRef.current !== null) window.clearInterval(keepAliveRef.current);
    keepAliveRef.current = window.setInterval(() => {
      const s = typeof window !== "undefined" ? window.speechSynthesis : undefined;
      if (s && s.speaking && !s.paused) {
        try {
          s.resume();
        } catch {
          /* ignora */
        }
      }
    }, 9000);
  };
  // ===========================================================================

  const cancelSpeech = useCallback(() => {
    // Invalida a sessão ANTES de cancelar: o cancel pode disparar
    // onend/onerror residual — já chega morto e não avança a página.
    sessaoLeituraRef.current += 1;
    // Parada total também cancela retomada pendente e auto-início.
    autoReadRef.current = false;
    autoStartRef.current = false;
    clearSpeechTimers();
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

  // Fim NATURAL da página (mesma sessão): vira a página sozinho e a
  // retomada acontece ao concluir a renderização (ver renderPage).
  const endOfPage = (sessao: number) => {
    if (sessaoLeituraRef.current !== sessao) return;
    clearSpeechTimers();
    utteranceRef.current = null;
    // A virada da página é automática: não há gesto novo do usuário.
    gestoRef.current = false;
    if (currentPage < numPages) {
      autoReadRef.current = true;
      setPageInput("");
      setCurrentPage(currentPage + 1);
    } else {
      stopReading();
    }
  };

  // Fala UM bloco curto e encadeia o próximo no onend. No iPhone o onend
  // às vezes não chega — daí o vigia, que também mantém a fala desperta.
  const speakChunk = (sessao: number) => {
    if (sessaoLeituraRef.current !== sessao) return;
    const blocos = chunksRef.current;
    const i = chunkIdxRef.current;
    if (i >= blocos.length) {
      endOfPage(sessao);
      return;
    }
    const texto = blocos[i];

    const utterance = new SpeechSynthesisUtterance(texto);
    const voz = pickVoice();
    if (voz) utterance.voice = voz;
    utterance.lang = 'pt-BR';
    utterance.rate = speechRateRef.current;

    let concluido = false;
    const concluir = () => {
      if (concluido) return false;
      concluido = true;
      if (watchdogRef.current !== null) {
        window.clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      if (startTimerRef.current !== null) {
        window.clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
      return true;
    };
    const avancar = () => {
      if (!concluir()) return;
      if (sessaoLeituraRef.current !== sessao) return;
      chunkIdxRef.current = i + 1;
      speakChunk(sessao);
    };

    utterance.onend = () => avancar();
    utterance.onerror = (ev) => {
      if (!concluir()) return;
      if (sessaoLeituraRef.current !== sessao) return;
      const err = (ev as SpeechSynthesisErrorEvent)?.error;
      // Cancelamento nosso (Parar/troca de página) — não é erro.
      if (err === 'interrupted' || err === 'canceled') return;
      console.warn('[narração] onerror:', err);
      stopReading();
      toast.error(
        err === 'not-allowed'
          ? 'O navegador bloqueou a voz. Toque em "Ouvir" para liberar.'
          : 'A narração foi interrompida pelo navegador.'
      );
    };

    utteranceRef.current = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[narração] speak() falhou:', e);
      stopReading();
      toast.error('Não foi possível iniciar a narração neste navegador.');
      return;
    }

    // Vigia 1 — início: fora de um toque do usuário o Safari iOS ignora a
    // fala em silêncio. Avisamos em vez de deixar o botão "preso" em Parar.
    startTimerRef.current = window.setTimeout(() => {
      if (concluido || sessaoLeituraRef.current !== sessao) return;
      const s = window.speechSynthesis;
      if (!s.speaking && !s.pending && !s.paused) {
        concluir();
        stopReading();
        toast.info(
          gestoRef.current
            ? 'O iPhone não iniciou a voz. Toque em "Ouvir" novamente.'
            : 'Toque em "Ouvir" para continuar a leitura.'
        );
      }
    }, 2500);

    // Vigia 2 — fim: se o onend nunca chegar, retoma ou avança sozinho.
    const previsao = Math.max(
      6000,
      (texto.length / (12 * Math.max(0.5, speechRateRef.current))) * 1000 + 8000
    );
    const vigia = () => {
      watchdogRef.current = window.setTimeout(() => {
        if (concluido || sessaoLeituraRef.current !== sessao) return;
        const s = window.speechSynthesis;
        if (s.speaking || s.pending) {
          try {
            s.resume();
          } catch {
            /* ignora */
          }
          vigia(); // ainda falando: só renova a vigilância
          return;
        }
        avancar(); // parou sem onend → presume fim do bloco
      }, previsao);
    };
    vigia();
  };

  const startReading = (readingDirection: 'TOP_TO_BOTTOM' | 'BOTTOM_TO_TOP' = 'TOP_TO_BOTTOM') => {
    // Nova sessão de leitura: invalida eventos de falas anteriores.
    const sessao = ++sessaoLeituraRef.current;
    // Zera vigias/keep-alive da página anterior (o iOS não perdoa timer órfão).
    clearSpeechTimers();

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

    // Cancela áudios anteriores (só se algo estiver ativo: um cancel()
    // desnecessário logo antes do speak() derruba a fala no iPhone)
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    setIsReading(true);
    pickVoice(); // pré-carrega a voz pt-BR (no iOS as vozes chegam atrasadas)

    // Destaca APENAS o span inicial (frase atual em leitura)
    if (layout.orderedSpans[0]) {
      highlightCurrentElement(layout.orderedSpans[0]);
    }

    // Auto-scroll para o início do conteúdo lido
    if (layout.orderedSpans[0]) {
      layout.orderedSpans[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Blocos curtos em vez de um utterance gigante (limite do Safari iOS).
    chunksRef.current = splitForSpeech(layout.fullText);
    chunkIdxRef.current = 0;
    startKeepAlive();
    // Fala o primeiro bloco SINCRONIZADAMENTE com o toque do usuário —
    // é exigência do iOS (o setTimeout de 100ms que existia aqui quebrava).
    speakChunk(sessao);
  };

const stopReading = () => {
    // Invalida a sessão ANTES de cancelar (o cancel pode disparar
    // onend/onerror residual — já chega morto e não avança a página).
    sessaoLeituraRef.current += 1;
    // Parada total também cancela retomada pendente (pulo de página vazia).
    autoReadRef.current = false;
    clearSpeechTimers();
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
      // Toque do usuário = gesto válido para o Safari iOS permitir a fala.
      gestoRef.current = true;
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
          // pedido pendente (avanço automático, troca manual com áudio
          // ativo ou auto-início da abertura dirigida) — narra a página.
          if (autoReadRef.current || autoStartRef.current) {
            autoReadRef.current = false;
            autoStartRef.current = false;
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
    autoStartRef.current = false;
    didFitRef.current = false;
    didInitRef.current = false;
    fitScaleRef.current = 1;
    zoomManualRef.current = false;
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

  // iPhone/iOS: as vozes do sistema chegam DEPOIS do carregamento da página.
  // Aquecemos aqui para que a primeira narração já encontre uma voz pt-BR.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Este navegador não suporta narração em voz alta.");
      return;
    }
    const synth = window.speechSynthesis;
    const carregar = () => pickVoice();
    carregar();
    const t = window.setTimeout(carregar, 600);
    const t2 = window.setTimeout(carregar, 2000);
    synth.addEventListener?.("voiceschanged", carregar);
    return () => {
      synth.removeEventListener?.("voiceschanged", carregar);
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  // Zoom inicial: encaixa a PÁGINA INTEIRA na tela (menor entre ajuste
  // à largura e à altura) — quase sem barra de rolagem. Reajusta sozinho
  // se a tela mudar (girar o celular, redimensionar a janela), a menos
  // que o usuário tenha mexido no zoom manualmente.
  const aplicarFit = async () => {
    if (!pdfDoc) return;
    try {
      const pageObj = await pdfDoc.getPage(1);
      const v = pageObj.getViewport({ scale: 1 });
      const el = containerRef.current;
      if (!el || v.width <= 0 || v.height <= 0) return;
      // Mede o respiro real (no celular o padding é menor).
      const style = getComputedStyle(el);
      const padX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      const padY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
      const dispW = el.clientWidth - padX;
      const dispH = el.clientHeight - padY;
      if (dispW <= 0 || dispH <= 0) return;
      const fit = Math.min(2, Math.max(0.5, Math.min(dispW / v.width, dispH / v.height)));
      fitScaleRef.current = fit;
      setScale(fit);
    } catch {
      /* mantém o zoom atual */
    }
  };
  aplicarFitRef.current = aplicarFit;

  useEffect(() => {
    if (!pdfDoc || didFitRef.current) return;
    didFitRef.current = true;
    void aplicarFitRef.current();
  }, [pdfDoc]);

  useEffect(() => {
    if (!pdfDoc || numPages < 1 || didInitRef.current) return;
    didInitRef.current = true;
    // Posiciona na página dirigida (uma vez por PDF)...
    const target = initialPage && initialPage > 1 ? Math.min(initialPage, numPages) : 1;
    if (target !== currentPage) goToPage(target);
    // ...e arma o auto-início (dispara ao concluir a renderização).
    if (autoStart) autoStartRef.current = true;
  }, [pdfDoc, numPages]);

  useEffect(() => {
    const onResize = () => {
      if (!pdfDoc || zoomManualRef.current) return;
      void aplicarFitRef.current();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
    // Robusto a escalas intermediárias (ajuste à tela pode não cair num nível).
    zoomManualRef.current = true;
    const next = ZOOM_LEVELS.find((l) => l > scale + 1e-6);
    if (next !== undefined) setScale(next);
  };

  const zoomOut = () => {
    zoomManualRef.current = true;
    const prev = [...ZOOM_LEVELS].reverse().find((l) => l < scale - 1e-6);
    if (prev !== undefined) setScale(prev);
  };

  // Reset volta ao ajuste à tela.
  const resetZoom = () => {
    zoomManualRef.current = false;
    setScale(fitScaleRef.current);
  };

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
              className="h-full overflow-auto p-4 max-sm:p-1 flex flex-col items-center"
            >
              {/* m-auto: centraliza no espaço livre; com rolagem comporta-se normal */}
              <div className="relative w-fit m-auto">
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
              <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 py-1.5 shadow-xl backdrop-blur-md max-w-full max-sm:gap-1 max-sm:px-2 max-sm:py-1">
              {/* Zoom — flutua sobre o PDF, não ocupa espaço de layout */}
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 max-sm:h-7 max-sm:w-7"
                  disabled={scale <= ZOOM_LEVELS[0]}
                  onClick={zoomOut}
                  aria-label="Diminuir zoom"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  onClick={resetZoom}
                  title="Redefinir zoom"
                  className="w-10 text-center text-[11px] font-bold text-white/70 hover:text-white cursor-pointer max-sm:w-8"
                >
                  {Math.round(scale * 100)}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 max-sm:h-7 max-sm:w-7"
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
                className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 max-sm:h-7 max-sm:w-7"
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
                className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 max-sm:h-7 max-sm:w-7"
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
                    ? "h-8 gap-1.5 px-3 max-sm:h-7 max-sm:px-2 text-xs font-bold rounded-full bg-red-500/85 text-white hover:bg-red-500 hover:text-white"
                    : "h-8 gap-1.5 px-3 max-sm:h-7 max-sm:px-2 text-xs font-bold rounded-full bg-white text-black hover:bg-white/90 hover:text-black"
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
                  // No iPhone, parar e recomeçar fora de um toque do usuário
                  // bloqueia a fala — então só trocamos a velocidade e os
                  // PRÓXIMOS blocos já saem na nova velocidade.
                }}
                className="h-8 px-1.5 rounded-md bg-white/10 border border-white/15 text-xs font-semibold text-white outline-none focus:border-white/40 cursor-pointer max-sm:h-7"
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