import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Superfície de vidro reutilizável.
 * Usa os tokens --glass-* do styles.css; não hardcode cores aqui.
 *
 * variant:
 *   default    → vidro padrão (cards, blocos)
 *   soft       → vidro quase transparente (enunciado de questão, leitura)
 *   strong     → vidro denso (modais, menus, topbar — mais contraste AA)
 *   pill       → pílula (chips, tab bar, menus flutuantes)
 *
 * interactive → adiciona elevação/brilho no hover (transição 220ms)
 */
type Variant = "default" | "soft" | "strong" | "pill";

const VARIANTS: Record<Variant, string> = {
  default: "glass",
  soft: "glass-soft",
  strong: "glass-strong",
  pill: "glass-pill",
};

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
  /** remove o raio padrão (para o item gerenciar o próprio) */
  square?: boolean;
  children?: ReactNode;
}

export function GlassCard({
  variant = "default",
  interactive = false,
  square = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        VARIANTS[variant],
        interactive && "glass-hover cursor-pointer",
        square && "rounded-none! shadow-none!",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
