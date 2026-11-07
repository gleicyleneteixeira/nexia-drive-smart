import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Wifi, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassBadge } from "./GlassBadge";
import type { NavSection } from "./nav";

/**
 * Sidebar lateral de VIDRO — flutuante (margem das bordas), recolhível.
 * Desktop apenas (lg+); no mobile quem navega é a GlassTabBar.
 *
 * Componente de apresentação: recebe as seções e callbacks.
 * A lógica de módulos/rotas continua no AppShell.
 */
export interface GlassSidebarProps {
  sections: NavSection[];
  /** id do item ativo (para a pílula de vidro destacada) */
  activeId: string | null;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate: (sectionId: string, itemId: string) => void;
  /** abre a paleta de comandos (Ctrl+K) */
  onOpenPalette: () => void;
  /** troca tema rosa/azul */
  onToggleTheme: () => void;
  themeIcon: string;
  user: { name: string; email: string } | null;
  onSignOut: () => void;
  logoHref: string;
  children?: React.ReactNode;
}

export function GlassSidebar({
  sections,
  activeId,
  collapsed,
  onToggleCollapsed,
  onNavigate,
  onOpenPalette,
  onToggleTheme,
  themeIcon,
  user,
  onSignOut,
  logoHref,
  children,
}: GlassSidebarProps) {
  const railRef = useRef<HTMLElement>(null);

  // atalho Ctrl+K / Cmd+K abre a paleta (registrado globalmente no AppShell,
  // aqui só garantimos que o rail seja focável via teclado)
  useEffect(() => {
    if (!collapsed) railRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = collapsed ? 76 : 264;

  return (
    <motion.aside
      ref={railRef}
      tabIndex={-1}
      aria-label="Menu principal"
      initial={false}
      animate={{ width }}
      transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-strong fixed left-3 top-3 bottom-3 z-40 hidden lg:flex flex-col",
        "rounded-[28px] overflow-hidden outline-none",
      )}
      style={{ width }}
    >
      {/* Topo: logo + nome + recolher */}
      <div className={cn("flex items-center gap-2.5 px-3 pt-3.5 pb-2", collapsed && "justify-center px-2")}>
        <Link
          to={logoHref}
          className="gradient-primary w-10 h-10 shrink-0 flex items-center justify-center text-primary-foreground font-black shadow-glow rounded-2xl"
          aria-label="Nexia Drive — início"
        >
          N
        </Link>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight truncate">Nexia Drive</p>
            <p className="text-[10px] text-muted-foreground leading-tight truncate">Simulado DETRAN</p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggleCollapsed}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            aria-label="Recolher menu"
            title="Recolher menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Busca → Ctrl+K */}
      <div className={cn("px-3 pb-2", collapsed && "px-2")}>
        <button
          onClick={onOpenPalette}
          className={cn(
            "glass-hover w-full flex items-center gap-2 rounded-2xl border border-white/12 bg-white/6",
            "px-3 h-10 text-muted-foreground hover:text-foreground transition-all",
            collapsed && "justify-center px-0",
          )}
          aria-label="Buscar páginas (Ctrl+K)"
          title="Buscar páginas — Ctrl+K"
        >
          <Search className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="text-[13px] flex-1 text-left">Buscar páginas</span>
              <kbd className="text-[10px] font-semibold bg-white/10 border border-white/15 rounded-md px-1.5 py-0.5">
                Ctrl K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Seções */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto no-scrollbar py-1",
          collapsed ? "px-2 space-y-1" : "px-3 space-y-4",
        )}
      >
        {sections.map((section) => (
          <div key={section.id}>
            {!collapsed && <p className="section-label px-3 pb-1.5">{section.label}</p>}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = activeId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => !item.soon && onNavigate(section.id, item.id)}
                      disabled={item.soon}
                      title={collapsed ? item.label + (item.soon ? " (Em breve)" : "") : undefined}
                      aria-current={active ? "page" : undefined}
                      aria-disabled={item.soon || undefined}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-2xl transition-all duration-200",
                        "min-h-[42px] text-left",
                        collapsed ? "justify-center px-0 h-11" : "px-3",
                        active
                          ? "glass-active text-foreground"
                          : item.soon
                            ? "text-muted-foreground/50 cursor-not-allowed"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/8 border border-transparent",
                      )}
                    >
                      <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
                      {!collapsed && (
                        <>
                          <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                          {item.soon && <GlassBadge tone="warning">Em breve</GlassBadge>}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Conteúdo extra do AppShell (bloco admin) */}
        {children}
      </nav>

      {/* Rodapé: usuário + tema + expandir */}
      <div className={cn("border-t border-white/12 p-3 space-y-2", collapsed && "px-2")}>
        {user && (
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-2xl bg-white/6 border border-white/10 p-2",
              collapsed && "justify-center p-1.5",
            )}
            title={`${user.name} — ${user.email}`}
          >
            <span className="relative shrink-0 w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
              <Wifi className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-success bg-background rounded-full p-[1px]" />
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold truncate">{user.name}</span>
                <span className="block text-[10px] text-muted-foreground truncate">{user.email}</span>
              </span>
            )}
          </div>
        )}

        <div className={cn("flex items-center gap-1.5", collapsed && "flex-col")}>
          <button
            onClick={onToggleTheme}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-10 rounded-2xl",
              "text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all",
              collapsed && "w-10 flex-none",
            )}
            title="Alternar tema"
            aria-label="Alternar tema"
          >
            <span className="text-base leading-none">{themeIcon}</span>
            {!collapsed && <span className="text-[12px] font-medium">Tema</span>}
          </button>

          <button
            onClick={onSignOut}
            className={cn(
              "flex items-center justify-center gap-2 h-10 rounded-2xl",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all",
              collapsed ? "w-10" : "w-10 flex-none",
            )}
            title="Sair"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {collapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onToggleCollapsed}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                aria-label="Expandir menu"
                title="Expandir menu"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
