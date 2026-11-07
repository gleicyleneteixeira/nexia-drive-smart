import type { LucideIcon } from "lucide-react";
import {
  Home,
  Brain,
  BookOpen,
  Car,
  Library,
  Target,
  Trophy,
  Zap,
  Signpost,
  TrendingUp,
  MessageCircle,
  Palette,
  LogOut,
  Sparkles,
  Gauge,
  BookMarked,
} from "lucide-react";

/**
 * Modelo de navegação do Nexia Drive.
 * Fonte única usada pela SIDEBAR (desktop), pela TAB BAR (mobile) e
 * pela PALETA DE COMANDOS (Ctrl+K) — assim as três nunca divergem.
 *
 * Só navegação: nenhuma regra de negócio mora aqui.
 */

export type NavAction =
  /** volta ao hub (/app) e limpa o módulo ativo */
  | { kind: "home" }
  /** troca o módulo interno da área do aluno (sem mudar a lógica dele) */
  | { kind: "module"; module: "teorico" | "psicotecnico" | "direcao" }
  /** navega para uma rota */
  | { kind: "link"; to: string; search?: Record<string, string> }
  /** abre em nova aba (suporte/WhatsApp) */
  | { kind: "external"; href: string }
  /** ação do app (trocar tema, sair) */
  | { kind: "theme" }
  | { kind: "signout" };

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action: NavAction;
  /** módulo indisponível: visual desativado, sem clique */
  soon?: boolean;
  /** termos extras para a busca da paleta */
  keywords?: string[];
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

/** Os 5 eixos oficiais da prova — links diretos para o simulado por categoria. */
export const EIXOS_LINKS: NavItem[] = [
  { id: "eixo-legislacao", label: "Legislação", icon: BookOpen, action: { kind: "link", to: "/simulado", search: { categoria: "legislacao" } }, keywords: ["lei", "ctb", "legislar"] },
  { id: "eixo-defensiva", label: "Direção Defensiva", icon: Gauge, action: { kind: "link", to: "/simulado", search: { categoria: "direcao-defensiva" } }, keywords: ["defensiva", "seguranca"] },
  { id: "eixo-socorros", label: "Primeiros Socorros", icon: Sparkles, action: { kind: "link", to: "/simulado", search: { categoria: "primeiros-socorros" } }, keywords: ["socorro", "vitima", "resgate"] },
  { id: "eixo-mecanica", label: "Mecânica Básica", icon: Car, action: { kind: "link", to: "/simulado", search: { categoria: "mecanica" } }, keywords: ["motor", "veiculo"] },
  { id: "eixo-meio-ambiente", label: "Meio Ambiente", icon: TrendingUp, action: { kind: "link", to: "/simulado", search: { categoria: "meio-ambiente" } }, keywords: ["poluicao", "natureza"] },
];

/** Seções ESTUDAR e TREINAR (estáticas). CONTA é montada no AppShell
 *  porque depende do link de suporte vindo do banco. */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "estudar",
    label: "Estudar",
    items: [
      { id: "inicio", label: "Início", icon: Home, action: { kind: "home" }, keywords: ["hub", "dashboard", "comeco"] },
      { id: "psicotecnico", label: "Psicotécnico", icon: Brain, action: { kind: "module", module: "psicotecnico" }, keywords: ["ateno", "memoria", "raciocinio", "palografico", "teste"] },
      { id: "teorico", label: "Parte Teórica", icon: BookOpen, action: { kind: "module", module: "teorico" }, keywords: ["teoria", "legislacao", "simulado"] },
      ...EIXOS_LINKS,
      { id: "biblioteca", label: "Biblioteca", icon: Library, action: { kind: "link", to: "/biblioteca" }, keywords: ["livros", "pdf", "materiais", "videos"] },
      { id: "pratico", label: "Direção Prática", icon: Car, action: { kind: "module", module: "direcao" }, soon: true, keywords: ["pratica", "baliza", "manobras"] },
    ],
  },
  {
    id: "treinar",
    label: "Treinar",
    items: [
      { id: "simulado", label: "Simulados", icon: Target, action: { kind: "link", to: "/simulado" }, keywords: ["prova", "teste", "30 questoes", "completo", "prova real"] },
      { id: "mais-caem", label: "Questões que mais caem", icon: TrendingUp, action: { kind: "link", to: "/mais-caem" }, keywords: ["incidencia", "tema", "ranking", "desempenho"] },
      { id: "placas", label: "Treino de Placas", icon: Signpost, action: { kind: "link", to: "/placas" }, keywords: ["sinalizacao", "placa", "adivinhar"] },
      { id: "turbo", label: "Revisão Turbo", icon: Zap, action: { kind: "link", to: "/turbo" }, keywords: ["cards", "rapido", "revisar"] },
      { id: "livro", label: "Livro com narração", icon: BookMarked, action: { kind: "link", to: "/livro" }, keywords: ["ler", "narra", "audio", "pdf"] },
      { id: "conquistas", label: "Conquistas", icon: Trophy, action: { kind: "link", to: "/conquistas" }, keywords: ["medalhas", "ranking", "gamificacao"] },
    ],
  },
];

/** Itens de CONTA — o AppShell monta o href do suporte em tempo de execução. */
export function contaSection(supportHref: string | null): NavSection {
  return {
    id: "conta",
    label: "Conta",
    items: [
      { id: "suporte", label: "Suporte", icon: MessageCircle, action: { kind: "external", href: supportHref ?? "#" }, keywords: ["whatsapp", "ajuda", "falar"] },
      { id: "tema", label: "Alternar tema", icon: Palette, action: { kind: "theme" }, keywords: ["cor", "rosa", "azul", "escuro", "claro"] },
      { id: "sair", label: "Sair", icon: LogOut, action: { kind: "signout" }, keywords: ["logout", "encerrar"] },
    ],
  };
}

/** Itens da barra inferior (mobile) — 4 destinos + "Mais". */
export const TAB_BAR_ITEMS: NavItem[] = [
  { id: "inicio", label: "Início", icon: Home, action: { kind: "home" } },
  { id: "estudar", label: "Estudar", icon: BookOpen, action: { kind: "home" } }, // abre sheet
  { id: "simulado", label: "Simulados", icon: Target, action: { kind: "link", to: "/simulado" } },
  { id: "conquistas", label: "Conquistas", icon: Trophy, action: { kind: "link", to: "/conquistas" } },
  { id: "mais", label: "Mais", icon: Sparkles, action: { kind: "home" } }, // abre sheet
];

/** Achata as seções em uma lista (para a paleta de comandos). */
export function flattenSections(sections: NavSection[]): NavItem[] {
  return sections.flatMap((s) => s.items);
}
