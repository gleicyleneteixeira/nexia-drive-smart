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
} from "lucide-react";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.2, 1.5, 2, 2.5, 3];

interface PdfReaderProps {
  url?: string;
  className?: string;
}

export function PdfReader({ url, className = "" }: PdfReaderProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageInput, setPageInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const renderPage = useCallback(
    async (doc: PDFDocumentProxy, page: number, s: number) => {
      const canvas = canvasRef.current;
      if (!doc || !canvas) return;
      try {
        await PDFReaderService.renderPageToCanvas(doc, page, canvas, s);
      } catch (err) {
        console.error("Erro ao renderizar página:", err);
      }
    },
    [],
  );

  useEffect(() => {
    if (pdfDoc && currentPage >= 1 && currentPage <= numPages) {
      renderPage(pdfDoc, currentPage, scale);
    }
  }, [pdfDoc, currentPage, scale, numPages, renderPage]);

  const loadFromUrl = async (fileUrl: string, name?: string) => {
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setNumPages(0);
    setCurrentPage(1);
    setScale(1.2);
    setFileName(name ?? null);
    try {
      const doc = await PDFReaderService.loadDocument(fileUrl);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
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
    };
  }, [pdfDoc]);

  const goToPage = (p: number) => {
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

  const resetZoom = () => setScale(1.2);

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

            {/* Center: page navigation */}
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

          {/* Canvas area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto rounded-2xl glass p-4 flex justify-center"
          >
            <canvas
              ref={canvasRef}
              className="shadow-2xl rounded-sm max-w-full"
              style={{ maxWidth: "100%", height: "auto" }}
            />
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
