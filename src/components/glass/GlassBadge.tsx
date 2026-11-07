import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Badge (etiqueta) em vidro colorido — status, "Em breve", contadores.
 * Cores claras com contraste AA sobre o fundo escuro.
 */
type Tone = "brand" | "success" | "warning" | "danger" | "neutral" | "info";

const TONES: Record<Tone, string> = {
  brand: "bg-primary/15 text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  neutral: "bg-white/8 text-muted-foreground border-white/15",
  info: "bg-sky-400/15 text-sky-300 border-sky-300/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children?: ReactNode;
}

export function GlassBadge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5",
        "text-[10px] font-bold uppercase tracking-wider leading-none",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
