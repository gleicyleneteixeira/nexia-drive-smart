import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Topbar de VIDRO — fina, sticky, sem poluição.
 * Esquerda: logo + contexto da página (breadcrumb/título).
 * Centro: mensagem motivacional curta.
 * Direita: chip do usuário / ações.
 */
export interface GlassTopbarProps {
  title: string;
  /** subtítulo em caixa alta pequena (contexto, ex.: "Estudar") */
  eyebrow?: string;
  /** mensagem motivacional curta (desktop) */
  message?: ReactNode;
  /** chip à direita */
  right?: ReactNode;
  logoHref: string;
  onLogoClick?: () => void;
  /** botão de busca (mobile) → Ctrl+K */
  onOpenPalette?: () => void;
  className?: string;
}

export function GlassTopbar({
  title,
  eyebrow,
  message,
  right,
  logoHref,
  onLogoClick,
  onOpenPalette,
  className,
}: GlassTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 lg:pl-0",
        "backdrop-blur-xl backdrop-saturate-150",
        "bg-background/70 border-b border-white/10",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
        {/* Logo (mobile/desktop) */}
        <Link
          to={logoHref}
          onClick={onLogoClick}
          className="gradient-primary w-9 h-9 shrink-0 flex items-center justify-center text-primary-foreground font-black shadow-glow rounded-xl"
          aria-label="Nexia Drive — início"
        >
          N
        </Link>

        {/* Contexto da página */}
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="section-label leading-none hidden sm:block truncate whitespace-nowrap">
              {eyebrow}
            </p>
          )}
          <h1 className={cn("font-display font-bold text-foreground truncate leading-tight", eyebrow ? "text-sm mt-0.5" : "text-base")}>
            {title}
          </h1>
        </div>

        {/* Mensagem motivacional — só em telas médias/grandes */}
        {message && (
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            {message}
          </div>
        )}

        {/* Busca (atalho Ctrl+K) */}
        {onOpenPalette && (
          <button
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-white/6 border border-white/12 text-muted-foreground hover:text-foreground transition-all shrink-0"
            aria-label="Buscar páginas (Ctrl+K)"
            title="Buscar páginas — Ctrl+K"
          >
            <Search className="h-4 w-4" />
            <kbd className="text-[10px] font-semibold bg-white/10 border border-white/15 rounded-md px-1.5 py-0.5">
              Ctrl K
            </kbd>
          </button>
        )}

        {/* Chip do usuário / ações */}
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}
