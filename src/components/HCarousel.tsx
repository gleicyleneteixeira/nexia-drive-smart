import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrossel horizontal com rolagem lateral suave, SEM barra de rolagem visível,
 * com bolinhas de paginação embaixo e setas < > laterais (desktop).
 * Os filhos devem ter largura fixa (ex: "shrink-0 w-[240px] snap-start").
 */
export function HCarousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const cancelAnim = useRef<(() => void) | null>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const clientW = Math.max(1, el.clientWidth);
      const total = Math.max(1, Math.ceil((el.scrollWidth - 2) / clientW));
      setPages(total);
      setScrollable(el.scrollWidth > clientW + 8);
      setPage(Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / clientW))));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  // Rolagem suave manual: o scrollBy/scrollTo nativo com behavior:"smooth"
  // não anima neste container (fica em 0px), então animamos o scrollLeft via rAF.
  // Fallback: se nenhum frame disparar em 80ms (aba oculta / rAF suspenso),
  // aplica o destino instantaneamente para a setinha nunca ficar "morta".
  const smoothScrollTo = (el: HTMLDivElement, target: number) => {
    cancelAnim.current?.(); // interrompe animação anterior (cliques rápidos)
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const to = Math.min(max, Math.max(0, target));
    const from = el.scrollLeft;
    const dist = to - from;
    if (Math.abs(dist) < 1) return;
    const dur = 380;
    let start = 0;
    let done = false;
    const stop = () => {
      done = true;
      clearTimeout(timer);
      cancelAnim.current = null;
    };
    cancelAnim.current = stop;
    const timer = setTimeout(() => {
      if (done) return;
      el.scrollLeft = to;
      stop();
    }, 80);
    const step = (t: number) => {
      if (done) return;
      if (!start) {
        start = t;
        clearTimeout(timer); // primeiro frame: animação rodando, cancela o fallback
      }
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.scrollLeft = from + dist * eased;
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        stop();
      }
    };
    requestAnimationFrame(step);
  };

  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    smoothScrollTo(el, el.scrollLeft + dir * Math.max(140, el.clientWidth * 0.85));
  };

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    smoothScrollTo(el, i * el.clientWidth);
  };

  return (
    <div className="relative group/hc">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto py-2 snap-x snap-proximity scrollbar-none"
      >
        {children}
      </div>

      {scrollable && (
        <>
          <button
            type="button"
            aria-label="Rolar para a esquerda"
            onClick={() => go(-1)}
            className="hidden md:flex absolute -left-1 top-[calc(50%-14px)] -translate-y-1/2 z-10 h-9 w-9 rounded-full items-center justify-center glass border border-border/40 bg-background/85 backdrop-blur text-foreground/70 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all shadow-card active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Rolar para a direita"
            onClick={() => go(1)}
            className="hidden md:flex absolute -right-1 top-[calc(50%-14px)] -translate-y-1/2 z-10 h-9 w-9 rounded-full items-center justify-center glass border border-border/40 bg-background/85 backdrop-blur text-foreground/70 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all shadow-card active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex justify-center gap-1.5 mt-1">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para a página ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === page
                    ? "w-5 bg-primary shadow-glow"
                    : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
