import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { PdfReader } from "./PdfReader";

interface NativePdfModalProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export function NativePdfModal({ pdfUrl, title, onClose }: NativePdfModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 max-sm:p-0"
      onClick={handleOverlayClick}
    >
      {/* No celular: tela cheia de verdade (sem margem, borda ou raio) */}
      <div className="relative bg-card rounded-2xl w-full max-w-7xl h-[calc(100dvh-2rem)] flex flex-col shadow-2xl border animate-in fade-in zoom-in duration-200 max-sm:h-dvh max-sm:max-w-none max-sm:rounded-none max-sm:border-0">
        {/* Fechar — flutuante sobre o PDF, sem barra de topo */}
        <button
          onClick={onClose}
          aria-label="Fechar leitor"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 text-white/90 hover:text-white hover:bg-black/90 backdrop-blur-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* PDF Reader */}
        <div className="flex-1 overflow-hidden min-h-0">
          <PdfReader url={pdfUrl} title={title} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}