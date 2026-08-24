import * as pdfjsLib from "pdfjs-dist";
import { VerbosityLevel } from "pdfjs-dist";

declare const setVerbosityLevel: (level: number) => void;

// Configure PDF.js worker from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Silence pdfjs-dist font warnings (TT: undefined function)
if (typeof (pdfjsLib as any).setVerbosityLevel === "function") {
  (pdfjsLib as any).setVerbosityLevel(VerbosityLevel.ERRORS);
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
    const loadingTask = pdfjsLib.getDocument(source);
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
