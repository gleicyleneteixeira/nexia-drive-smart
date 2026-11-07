import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Botão de vidro / botão primário da marca.
 *
 * variant:
 *   primary  → gradiente rosa/magenta (CTA principal, glow sutil)
 *   glass    → vidro secundário (hover eleva e brilha)
 *   ghost    → sem superfície, só hover
 *   disabled → renderiza visualmente desativado (Ex.: "Em breve")
 */
type Variant = "primary" | "glass" | "ghost" | "disabled";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "gradient-primary text-primary-foreground shadow-glow font-bold hover:shadow-glow hover:brightness-110",
  glass:
    "glass glass-hover text-foreground font-semibold",
  ghost:
    "bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-white/8",
  disabled:
    "bg-white/8 border border-white/10 text-muted-foreground/70 cursor-not-allowed",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-xs rounded-xl gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-sm rounded-2xl gap-2",
};

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

export function GlassButton({
  variant = "glass",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: GlassButtonProps) {
  const isDisabled = disabled || variant === "disabled";
  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap cursor-pointer",
        "transition-[transform,box-shadow,background-color,border-color,filter] duration-200 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "active:scale-[0.98] disabled:pointer-events-none",
        VARIANTS[isDisabled ? "disabled" : variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
