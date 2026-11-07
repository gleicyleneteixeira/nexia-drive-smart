import { cn } from "@/lib/utils";
import type { NavItem } from "./nav";

/**
 * Barra inferior de VIDRO em pílula (mobile).
 * Flutua acima da borda, respeita a safe-area do celular,
 * item ativo ganha pílula + ponto de brilho.
 */
export interface GlassTabBarProps {
  items: NavItem[];
  activeId: string | null;
  onTab: (item: NavItem) => void;
}

export function GlassTabBar({ items, activeId, onTab }: GlassTabBarProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-3 left-3 right-3 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="glass-strong rounded-[26px] px-1.5 py-1.5 flex items-stretch justify-between gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTab(item)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex-1 min-w-0 min-h-[52px] rounded-[20px] flex flex-col items-center justify-center gap-1",
                "transition-all duration-200 active:scale-95",
                active ? "glass-active" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              <span
                className={cn(
                  "text-[10px] font-semibold leading-none truncate max-w-full px-1",
                  active && "text-foreground",
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "h-1 w-1 rounded-full transition-all duration-200",
                  active ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-transparent",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
