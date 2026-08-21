import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
  ): Promise<void> {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  },
};
