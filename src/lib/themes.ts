export type ThemeName = "dark" | "light";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  description: string;
  icon: string;
  variables: Record<string, string>;
}

export const themes: Record<ThemeName, ThemeConfig> = {
  dark: {
    name: "dark",
    label: "Escuro",
    description: "Tema escuro em tons de slate",
    icon: "🌙",
    variables: {
      "--background": "oklch(0.15 0.02 260)",
      "--foreground": "oklch(0.98 0.005 250)",
      "--card": "oklch(0.20 0.02 260)",
      "--card-foreground": "oklch(0.98 0.005 250)",
      "--popover": "oklch(0.20 0.02 260)",
      "--popover-foreground": "oklch(0.98 0.005 250)",
      "--primary": "oklch(0.65 0.22 15)",
      "--primary-foreground": "oklch(0.98 0.005 250)",
      "--primary-glow": "oklch(0.75 0.20 350)",
      "--secondary": "oklch(0.25 0.02 260)",
      "--secondary-foreground": "oklch(0.98 0.005 250)",
      "--muted": "oklch(0.22 0.02 260)",
      "--muted-foreground": "oklch(0.65 0.02 255)",
      "--accent": "oklch(0.30 0.05 260)",
      "--accent-foreground": "oklch(0.98 0.005 250)",
      "--success": "oklch(0.72 0.18 150)",
      "--success-foreground": "oklch(0.15 0.03 150)",
      "--warning": "oklch(0.82 0.16 85)",
      "--warning-foreground": "oklch(0.2 0.04 80)",
      "--destructive": "oklch(0.65 0.22 25)",
      "--destructive-foreground": "oklch(0.98 0.005 250)",
      "--border": "oklch(0.28 0.02 260 / 0.6)",
      "--input": "oklch(0.25 0.02 260 / 0.8)",
      "--ring": "oklch(0.65 0.22 15)",
      "--chart-1": "oklch(0.65 0.22 15)",
      "--chart-2": "oklch(0.72 0.18 150)",
      "--chart-3": "oklch(0.82 0.16 85)",
      "--chart-4": "oklch(0.65 0.22 25)",
      "--chart-5": "oklch(0.7 0.2 300)",
    },
  },
  light: {
    name: "light",
    label: "Claro",
    description: "Tema claro com alto contraste",
    icon: "☀️",
    variables: {
      "--background": "oklch(0.98 0.004 250)",
      "--foreground": "oklch(0.20 0.02 260)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.20 0.02 260)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.20 0.02 260)",
      "--primary": "oklch(0.52 0.18 250)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.62 0.16 265)",
      "--secondary": "oklch(0.94 0.01 250)",
      "--secondary-foreground": "oklch(0.25 0.02 260)",
      "--muted": "oklch(0.95 0.008 250)",
      "--muted-foreground": "oklch(0.43 0.02 255)",
      "--accent": "oklch(0.92 0.025 250)",
      "--accent-foreground": "oklch(0.22 0.02 260)",
      "--success": "oklch(0.49 0.15 150)",
      "--success-foreground": "oklch(0.99 0 0)",
      "--warning": "oklch(0.72 0.14 75)",
      "--warning-foreground": "oklch(0.2 0.04 80)",
      "--destructive": "oklch(0.55 0.20 25)",
      "--destructive-foreground": "oklch(0.99 0 0)",
      "--border": "oklch(0.84 0.012 255)",
      "--input": "oklch(0.88 0.01 255)",
      "--ring": "oklch(0.52 0.18 250)",
      "--chart-1": "oklch(0.52 0.18 250)",
      "--chart-2": "oklch(0.49 0.15 150)",
      "--chart-3": "oklch(0.72 0.14 75)",
      "--chart-4": "oklch(0.55 0.20 25)",
      "--chart-5": "oklch(0.7 0.2 300)",
    },
  },
};

export const STORAGE_THEME_KEY = "@nexia_theme_v1";
export const DEFAULT_THEME: ThemeName = "dark";
