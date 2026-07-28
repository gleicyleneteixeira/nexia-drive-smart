import { forwardRef, useEffect, useRef, useState } from "react";
// @ts-ignore - react-pageflip lacks complete types
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
// Bundle the worker locally so it always matches the installed pdfjs-dist version
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Props {
  url: string;
}

const PageSheet = forwardRef<HTMLDivElement, { pageNumber: number; width: number }>(
  ({ pageNumber, width }, ref) => (
    <div ref={ref} className="bg-white overflow-hidden">
      <Page
        pageNumber={pageNumber}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  ),
);
PageSheet.displayName = "PageSheet";

export function PdfFlipbook({ url }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [size, setSize] = useState({ w: 400, h: 560 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const isMobile = cw < 700;
      const pageW = isMobile ? Math.min(cw - 16, 480) : Math.min(Math.floor(cw / 2), 500);
      setSize({ w: pageW, h: Math.floor(pageW * 1.4) });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="py-20 text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />Carregando livro...
          </div>
        }
        error={
          <div className="py-10 text-center">
            <p className="text-destructive mb-3">Não foi possível carregar o PDF.</p>
            <a href={url} target="_blank" rel="noreferrer" className="text-primary underline text-sm">
              Abrir PDF em nova aba
            </a>
          </div>
        }
      >
        {numPages > 0 && (
          // @ts-ignore — react-pageflip has incomplete types
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
            className="shadow-2xl rounded-lg"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <PageSheet key={i} pageNumber={i + 1} width={size.w} />
            ))}
          </HTMLFlipBook>
        )}
      </Document>
    </div>
  );
}
