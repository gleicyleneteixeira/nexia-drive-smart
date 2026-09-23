export type ThemeName = 'rosa' | 'azul';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  description: string;
  icon: string;
  variables: Record<string, string>;
}

export const themes: Record<ThemeName, ThemeConfig> = {
  rosa: {
    name: 'rosa',
    label: 'Rosa',
    description: 'Tema escuro com acentos rose/pink',
    icon: '🩷',
    variables: {
      '--background': 'oklch(0.15 0.02 260)',
      '--foreground': 'oklch(0.98 0.005 250)',
      '--card': 'oklch(0.20 0.02 260)',
      '--card-foreground': 'oklch(0.98 0.005 250)',
      '--popover': 'oklch(0.20 0.02 260)',
      '--popover-foreground': 'oklch(0.98 0.005 250)',
      '--primary': 'oklch(0.65 0.22 15)',
      '--primary-foreground': 'oklch(0.98 0.005 250)',
      '--primary-glow': 'oklch(0.75 0.20 350)',
      '--secondary': 'oklch(0.25 0.02 260)',
      '--secondary-foreground': 'oklch(0.98 0.005 250)',
      '--muted': 'oklch(0.22 0.02 260)',
      '--muted-foreground': 'oklch(0.65 0.02 255)',
      '--accent': 'oklch(0.30 0.05 260)',
      '--accent-foreground': 'oklch(0.98 0.005 250)',
      '--success': 'oklch(0.72 0.18 150)',
      '--success-foreground': 'oklch(0.15 0.03 150)',
      '--warning': 'oklch(0.82 0.16 85)',
      '--warning-foreground': 'oklch(0.2 0.04 80)',
      '--destructive': 'oklch(0.65 0.22 25)',
      '--destructive-foreground': 'oklch(0.98 0.005 250)',
      '--border': 'oklch(0.28 0.02 260 / 0.6)',
      '--input': 'oklch(0.25 0.02 260 / 0.8)',
      '--ring': 'oklch(0.65 0.22 15)',
      '--chart-1': 'oklch(0.65 0.22 15)',
      '--chart-2': 'oklch(0.72 0.18 150)',
      '--chart-3': 'oklch(0.82 0.16 85)',
      '--chart-4': 'oklch(0.65 0.22 25)',
      '--chart-5': 'oklch(0.7 0.2 300)',
    },
  },
  azul: {
    name: 'azul',
    label: 'Azul',
    description: 'Tema navy escuro com acentos azuis',
    icon: '💙',
    variables: {
      '--background': 'oklch(0.18 0.04 260)',
      '--foreground': 'oklch(0.98 0.005 250)',
      '--card': 'oklch(0.22 0.04 260)',
      '--card-foreground': 'oklch(0.98 0.005 250)',
      '--popover': 'oklch(0.22 0.04 260)',
      '--popover-foreground': 'oklch(0.98 0.005 250)',
      '--primary': 'oklch(0.68 0.19 245)',
      '--primary-foreground': 'oklch(0.15 0.03 260)',
      '--primary-glow': 'oklch(0.78 0.18 230)',
      '--secondary': 'oklch(0.28 0.04 260)',
      '--secondary-foreground': 'oklch(0.98 0.005 250)',
      '--muted': 'oklch(0.26 0.03 260)',
      '--muted-foreground': 'oklch(0.72 0.02 255)',
      '--accent': 'oklch(0.32 0.07 250)',
      '--accent-foreground': 'oklch(0.98 0.005 250)',
      '--success': 'oklch(0.72 0.18 150)',
      '--success-foreground': 'oklch(0.15 0.03 150)',
      '--warning': 'oklch(0.82 0.16 85)',
      '--warning-foreground': 'oklch(0.2 0.04 80)',
      '--destructive': 'oklch(0.65 0.22 25)',
      '--destructive-foreground': 'oklch(0.98 0.005 250)',
      '--border': 'oklch(0.3 0.03 260 / 0.5)',
      '--input': 'oklch(0.3 0.03 260 / 0.6)',
      '--ring': 'oklch(0.68 0.19 245)',
      '--chart-1': 'oklch(0.68 0.19 245)',
      '--chart-2': 'oklch(0.72 0.18 150)',
      '--chart-3': 'oklch(0.82 0.16 85)',
      '--chart-4': 'oklch(0.65 0.22 25)',
      '--chart-5': 'oklch(0.7 0.2 300)',
    },
  },
};

export const STORAGE_THEME_KEY = '@nexia_theme_v1';
export const DEFAULT_THEME: ThemeName = 'rosa';
