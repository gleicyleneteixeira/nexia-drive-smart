import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav";

/**
 * Bottom sheet de VIDRO (mobile) — usado pelos itens "Estudar" e "Mais"
 * da tab bar, para não lotar a barra principal.
 * Fecha no backdrop, no X e no Escape. Alvo de toque >= 44px.
 */
export interface GlassSheetProps {
  open: boolean;
  title: string;
  items: NavItem[];
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
}

export function GlassSheet({ open, title, items, onClose, onNavigate }: GlassSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed left-2 right-2 bottom-2 z-50 rounded-[28px] p-4 lg:hidden"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">{title}</p>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (item.soon) return;
                        onNavigate(item);
                        onClose();
                      }}
                      disabled={item.soon}
                      aria-disabled={item.soon || undefined}
                      className={cn(
                        "w-full min-h-[48px] flex items-center gap-3 rounded-2xl px-3 text-left",
                        "transition-all duration-200",
                        item.soon
                          ? "text-muted-foreground/50 cursor-not-allowed"
                          : "text-foreground hover:bg-white/10 active:scale-[0.99]",
                      )}
                    >
                      <span className="w-9 h-9 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center shrink-0">
                        <Icon className={cn("h-4 w-4", !item.soon && "text-primary")} />
                      </span>
                      <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                      {item.soon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-warning">
                          Em breve
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
