import { forwardRef, useEffect, useRef, useState } from "react";
// @ts-ignore - react-pageflip lacks complete types
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

// Bundle the worker locally so it always matches the installed pdfjs-dist version
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Props {
  url: string;
}

const FlipPage = forwardRef<HTMLDivElement, { src: string; alt: string; width: number; height: number }>(
  ({ src, alt, width, height }, ref) => (
    <div 
      ref={ref} 
      className="bg-white overflow-hidden shadow-md flex items-center justify-center select-none"
      style={{ width, height }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain pointer-events-none" 
      />
    </div>
  ),
);
FlipPage.displayName = "FlipPage";

export function PdfFlipbook({ url }: Props) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [size, setSize] = useState({ w: 400, h: 560 });
  const [aspectRatio, setAspectRatio] = useState(1.4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProgress(0);
    setTotalPages(0);
    setError(null);
    setPages([]);

    const convertPdfToImages = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Falha ao baixar o arquivo PDF.");
        const arrayBuffer = await response.arrayBuffer();
        if (!active) return;

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (!active) return;
        
        setTotalPages(pdf.numPages);
        
        if (pdf.numPages > 0) {
          const firstPage = await pdf.getPage(1);
          const firstViewport = firstPage.getViewport({ scale: 1 });
          if (active) {
            setAspectRatio(firstViewport.height / firstViewport.width);
          }
        }

        const pageImages: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          if (!active) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // High quality HD
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            if (!active) return;
            pageImages.push(canvas.toDataURL("image/jpeg", 0.85));
            setProgress(i);
          }
        }

        if (active) {
          setPages(pageImages);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao converter PDF para imagens:", err);
        if (active) {
          setError("Não foi possível carregar o PDF. Verifique o arquivo e tente novamente.");
          setLoading(false);
        }
      }
    };

    convertPdfToImages();

    return () => {
      active = false;
    };
  }, [url]);

  useEffect(() => {
    function update() {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const isMobile = cw < 700;
      const pageW = isMobile ? Math.min(cw - 16, 480) : Math.min(Math.floor(cw / 2), 500);
      setSize({ w: pageW, h: Math.floor(pageW * aspectRatio) });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [aspectRatio]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setProgress(0);
    setTotalPages(0);
    setPages([]);
    
    let active = true;
    const convertPdfToImages = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Falha ao baixar o arquivo PDF.");
        const arrayBuffer = await response.arrayBuffer();
        if (!active) return;

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (!active) return;
        setTotalPages(pdf.numPages);
        if (pdf.numPages > 0) {
          const firstPage = await pdf.getPage(1);
          const firstViewport = firstPage.getViewport({ scale: 1 });
          setAspectRatio(firstViewport.height / firstViewport.width);
        }
        const pageImages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (!active) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            if (!active) return;
            pageImages.push(canvas.toDataURL("image/jpeg", 0.85));
            setProgress(i);
          }
        }
        if (active) {
          setPages(pageImages);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao reconverter PDF para imagens:", err);
        if (active) {
          setError("Não foi possível carregar o PDF. Verifique o arquivo e tente novamente.");
          setLoading(false);
        }
      }
    };
    convertPdfToImages();
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center select-none">
      {/* Loading state */}
      {loading && !error && (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px] glass rounded-3xl max-w-md mx-auto space-y-6 animate-pulse">
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary opacity-25" />
            <Loader2 className="h-16 w-16 animate-spin text-primary absolute border-t-transparent" />
          </div>
          <div className="space-y-2 text-center w-full">
            <h3 className="font-display font-bold text-lg text-foreground">Preparando seu Livro</h3>
            <p className="text-sm text-muted-foreground">
              Convertendo PDF para formato interativo...
            </p>
            {totalPages > 0 && (
              <div className="w-full bg-secondary/50 rounded-full h-2 mt-4 overflow-hidden border border-border/10">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out shadow-glow" 
                  style={{ width: `${(progress / totalPages) * 100}%` }}
                />
              </div>
            )}
            <p className="text-xs text-primary font-mono mt-2 font-semibold">
              Página {progress} de {totalPages || "?"}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 text-center glass rounded-3xl max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base">Falha ao carregar o livro</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{error}</p>
          </div>
          <div className="flex flex-col gap-2 w-full pt-2">
            <Button onClick={handleRetry} className="w-full flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" /> Tentar novamente
            </Button>
            <a 
              href={url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-primary hover:underline font-semibold block py-2"
            >
              Abrir PDF em nova aba
            </a>
          </div>
        </div>
      )}

      {/* Flipbook state */}
      {!loading && !error && pages.length > 0 && (
        <div className="w-full flex justify-center">
          {/* @ts-ignore — react-pageflip has incomplete types */}
          <HTMLFlipBook
            width={size.w}
            height={size.h}
            size="stretch"
            minWidth={260}
            maxWidth={1000}
            minHeight={360}
            maxHeight={1400}
            showCover
            usePortrait
            mobileScrollSupport
            maxShadowOpacity={0.4}
            className="shadow-2xl rounded-lg overflow-hidden bg-background/20"
          >
            {pages.map((pageSrc, index) => (
              <FlipPage 
                key={index} 
                src={pageSrc} 
                alt={`Página ${index + 1}`} 
                width={size.w}
                height={size.h}
              />
            ))}
          </HTMLFlipBook>
        </div>
      )}
    </div>
  );
}
