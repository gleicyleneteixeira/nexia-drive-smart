import { cn } from "@/lib/utils";
import type { NavItem } from "./nav";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 56;
const CONTENT_INSET = 44;
const CONTENT_WIDTH = VIEWBOX_WIDTH - CONTENT_INSET * 2;

function pillPath(activeIndex: number, itemCount: number): string {
  if (activeIndex < 0 || itemCount === 0) {
    return "M 32 6 H 968 C 982 6 992 15 992 24 V 36 C 992 48 980 56 962 56 H 38 C 20 56 8 48 8 36 V 24 C 8 15 18 6 32 6 Z";
  }

  const slotWidth = CONTENT_WIDTH / itemCount;
  const center = CONTENT_INSET + slotWidth * (activeIndex + 0.5);
  const notchHalfWidth = Math.min(86, slotWidth * 0.52);
  const notchLeft = center - notchHalfWidth;
  const notchRight = center + notchHalfWidth;
  const leftTop = Math.min(32, notchLeft);
  const rightTop = Math.max(968, notchRight);

  return [
    `M ${leftTop} 6`,
    `H ${notchLeft}`,
    `C ${notchLeft + 10} 6 ${center - 20} 34 ${center} 34`,
    `C ${center + 20} 34 ${notchRight - 10} 6 ${notchRight} 6`,
    `H ${rightTop}`,
    "C 982 6 992 15 992 24",
    "V 36",
    "C 992 48 980 56 962 56",
    "H 38",
    "C 20 56 8 48 8 36",
    "V 24",
    `C 8 15 18 6 ${leftTop} 6`,
    "Z",
  ].join(" ");
}

function pillMask(path: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" preserveAspectRatio="none"><path fill="white" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export interface GlassTabBarProps {
  items: NavItem[];
  activeId: string | null;
  onTab: (item: NavItem) => void;
}

export function GlassTabBar({ items, activeId, onTab }: GlassTabBarProps) {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;
  const ActiveIcon = activeItem?.icon;
  const outline = pillPath(activeIndex, items.length);
  const maskImage = pillMask(outline);
  const activePosition =
    activeIndex >= 0 ? `${4.4 + (91.2 * (activeIndex + 0.5)) / items.length}%` : undefined;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-4 left-1/2 z-50 min-h-[56px] w-[calc(100%-24px)] -translate-x-1/2 overflow-visible pt-4 lg:hidden"
    >
      <div className="relative h-[56px] w-full overflow-visible">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "color-mix(in srgb, var(--glass-bg-strong) 82%, transparent)",
            backdropFilter: "blur(var(--glass-blur-lg)) saturate(var(--glass-saturate))",
            WebkitBackdropFilter: "blur(var(--glass-blur-lg)) saturate(var(--glass-saturate))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 32px rgba(0,0,0,0.32)",
            maskImage,
            WebkitMaskImage: maskImage,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
        />

        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-[56px] w-full overflow-visible"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path
            d={outline}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={outline}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute inset-y-0 z-10 flex" style={{ left: "4.4%", right: "4.4%" }}>
          {items.map((item, index) => {
            const Icon = item.icon;
            const active = activeIndex === index;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!item.soon) onTab(item);
                }}
                disabled={item.soon}
                aria-label={item.soon ? `${item.label} (em breve)` : item.label}
                title={item.soon ? "Em breve" : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 pt-4 leading-none",
                  item.soon && "cursor-not-allowed opacity-50",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-4 w-4 items-center justify-center transition-opacity duration-200",
                    active ? "opacity-0" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    "max-w-full truncate px-0.5 text-center text-[8px] font-semibold leading-none sm:text-[10px]",
                    active ? "text-white" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "h-0.5 w-0.5 rounded-full transition-colors duration-200",
                    active
                      ? "bg-[#ec4899] shadow-[0_0_8px_rgba(236,72,153,0.9)]"
                      : "bg-transparent",
                  )}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        {ActiveIcon && activePosition && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-4 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border transition-[left] duration-300 ease-out"
            style={{
              borderColor: "rgba(236,72,153,0.9)",
              background:
                "radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.42) 0%, rgba(236,72,153,0.30) 28%, rgba(86,12,53,0.82) 100%)",
              backdropFilter: "blur(14px) saturate(165%)",
              WebkitBackdropFilter: "blur(14px) saturate(165%)",
              boxShadow:
                "0 0 16px rgba(236,72,153,0.46), inset 0 1px 5px rgba(255,255,255,0.38), inset 0 -6px 14px rgba(86,12,53,0.38)",
              left: activePosition,
            }}
          >
            <span className="absolute left-[7px] top-[4px] h-2.5 w-4 rounded-full bg-white/40 blur-[3px]" />
            <ActiveIcon className="relative z-10 h-4 w-4 text-white" />
          </span>
        )}
      </div>
    </nav>
  );
}
