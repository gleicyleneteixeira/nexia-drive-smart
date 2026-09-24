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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-card rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl border animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display font-bold text-lg truncate max-w-[calc(100%-120px)]">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Reader */}
        <div className="flex-1 overflow-hidden min-h-0">
          <PdfReader url={pdfUrl} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}