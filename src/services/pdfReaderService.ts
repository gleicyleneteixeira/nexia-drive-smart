// pdf.js usa DOMMatrix no top-level e NÃO existe no Node — import estático
// aqui quebrava o SSR (HTTP 500 no /app). Import dinâmico: só carrega no
// navegador, na primeira utilização real.
type PdfJsLib = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJsLib> | null = null;

async function getPdfjs(): Promise<PdfJsLib> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((lib) => {
      // Configure PDF.js worker from CDN
      lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
      // Silence pdfjs-dist font warnings (TT: undefined function)
      if (typeof (lib as any).setVerbosityLevel === "function") {
        (lib as any).setVerbosityLevel((lib as any).VerbosityLevel.ERRORS);
      }
      return lib;
    });
  }
  return pdfjsPromise;
}

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNo: number) => Promise<any>;
}

export const PDFReaderService = {
  async loadDocument(fileOrUrl: File | string): Promise<PDFDocumentProxy> {
    let source: any;
    if (fileOrUrl instanceof File) {
      const arrayBuffer = await fileOrUrl.arrayBuffer();
      source = { data: arrayBuffer };
    } else {
      source = { url: fileOrUrl };
    }
    const loadingTask = (await getPdfjs()).getDocument(source);
    return await loadingTask.promise;
  },

  async renderPageToCanvas(
    pdfDoc: PDFDocumentProxy,
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale: number = 1.2,
  ): Promise<any> {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Define dimensões físicas reais baseadas no viewport calculado
    // (sem max-width: 100% para permitir estouro horizontal no mobile)
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // Return the render task so caller can cancel/await
    return page.render(renderContext);
  },
};
