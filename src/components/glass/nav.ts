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

/** Módulo escolhido no Início (hub = nenhum módulo escolhido ainda). */
export type ModuloAtivo = "hub" | "teorico" | "psicotecnico" | "direcao";

/**
 * Item "Simulados" — muda conforme o módulo escolhido no Início:
 *  - teórico/hub → "Simulados" (prova de 30 em /simulado);
 *  - psicotécnico → "Treinar agora" levando aos joguinhos (/psicotecnico).
 * Mesmo id ("simulado") nas duas versões para a pílula ativa não mudar de lugar.
 */
export function simuladosItem(modulo: ModuloAtivo): NavItem {
  return modulo === "psicotecnico"
    ? {
        id: "simulado",
        label: "Treinar agora",
        icon: Target,
        action: { kind: "link", to: "/psicotecnico" },
        keywords: [
          "treino",
          "joguinhos",
          "psicotecnico",
          "atencao",
          "memoria",
          "raciocinio",
          "palografico",
        ],
      }
    : {
        id: "simulado",
        label: "Simulados",
        icon: Target,
        action: { kind: "link", to: "/simulado" },
        keywords: ["prova", "teste", "30 questoes", "completo", "prova real"],
      };
}

/** Seções laterais contextualizadas pelo módulo ativo (sidebar + paleta + sheets). */
export function navSections(modulo: ModuloAtivo): NavSection[] {
  // No teórico o item é a prova completa (nome explícito dentro da seção
  // "Simulados"); no psicotécnico é o atalho "Treinar agora" dos joguinhos.
  const simulos =
    modulo === "psicotecnico"
      ? simuladosItem(modulo)
      : { ...simuladosItem(modulo), label: "Simulado completo" };
  return NAV_SECTIONS.map((s) =>
    s.id === "treinar"
      ? { ...s, items: [simulos, ...s.items.filter((i) => i.id !== "simulado")] }
      : s,
  );
}

/** Tab bar (mobile) contextualizada. No psicotécnico o rótulo vira "Treino"
 *  (curto: "Treinar agora" não cabe na pílula de 5 abas). */
export function tabBarItems(modulo: ModuloAtivo): NavItem[] {
  const simulos = simuladosItem(modulo);
  const item = modulo === "psicotecnico" ? { ...simulos, label: "Treino" } : simulos;
  return TAB_BAR_ITEMS.map((i) => (i.id === "simulado" ? item : i));
}

/**
 * Seções AULAS E MATERIAIS (conteúdo) e SIMULADOS (treino/prova).
 *
 * A separação é intencional: conteúdo de aula mora na primeira, prova e
 * treino na segunda. Nada de eixo de matéria dentro de "aulas" — os eixos
 * são atalhos de SIMULADO e por isso vivem na seção de simulados.
 *
 * CONTA é montada no AppShell porque depende do link de suporte do banco.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "estudar",
    label: "Aulas e materiais",
    items: [
      { id: "inicio", label: "Início", icon: Home, action: { kind: "home" }, keywords: ["hub", "dashboard", "comeco"] },
      { id: "teorico", label: "Aulas da teoria", icon: BookOpen, action: { kind: "module", module: "teorico" }, keywords: ["teoria", "aulas", "conteudo", "resumo"] },
      { id: "psicotecnico", label: "Psicotécnico", icon: Brain, action: { kind: "module", module: "psicotecnico" }, keywords: ["ateno", "memoria", "raciocinio", "palografico", "teste"] },
      { id: "galerias", label: "Galerias e biblioteca", icon: Library, action: { kind: "link", to: "/biblioteca" }, keywords: ["livros", "pdf", "materiais", "videos", "galeria", "apostila"] },
      { id: "livro", label: "Resumos narrados", icon: BookMarked, action: { kind: "link", to: "/livro" }, keywords: ["ler", "narra", "audio", "pdf", "resumo", "ouvir"] },
      { id: "placas-catalogo", label: "Guia de placas", icon: Signpost, action: { kind: "link", to: "/placas", search: { ver: "catalogo" } }, keywords: ["sinalizacao", "placa", "significado", "catalogo", "consultar"] },
      { id: "pratico", label: "Direção Prática", icon: Car, action: { kind: "module", module: "direcao" }, soon: true, keywords: ["pratica", "baliza", "manobras"] },
    ],
  },
  {
    id: "treinar",
    label: "Simulados",
    items: [
      { id: "simulado", label: "Simulado completo", icon: Target, action: { kind: "link", to: "/simulado" }, keywords: ["prova", "teste", "30 questoes", "completo", "prova real"] },
      ...EIXOS_LINKS,
      { id: "placas-quiz", label: "Treino de placas", icon: Signpost, action: { kind: "link", to: "/placas", search: { ver: "simulado" } }, keywords: ["sinalizacao", "placa", "quiz", "adivinhar", "simulado"] },
      { id: "mais-caem", label: "Questões que mais caem", icon: TrendingUp, action: { kind: "link", to: "/mais-caem" }, keywords: ["incidencia", "tema", "ranking", "desempenho"] },
      { id: "turbo", label: "Revisão Turbo", icon: Zap, action: { kind: "link", to: "/turbo" }, keywords: ["cards", "rapido", "revisar"] },
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
      { id: "tema", label: "Alternar tema", icon: Palette, action: { kind: "theme" }, keywords: ["cor", "tema", "escuro", "claro"] },
      { id: "sair", label: "Sair", icon: LogOut, action: { kind: "signout" }, keywords: ["logout", "encerrar"] },
    ],
  };
}

/** Itens da barra inferior (mobile) — 4 destinos + "Mais". */
export const TAB_BAR_ITEMS: NavItem[] = [
  { id: "inicio", label: "Início", icon: Home, action: { kind: "home" } },
  { id: "estudar", label: "Aulas", icon: BookOpen, action: { kind: "home" } }, // abre sheet
  { id: "simulado", label: "Simulados", icon: Target, action: { kind: "link", to: "/simulado" } },
  { id: "conquistas", label: "Conquistas", icon: Trophy, action: { kind: "link", to: "/conquistas" } },
  { id: "mais", label: "Mais", icon: Sparkles, action: { kind: "home" } }, // abre sheet
];

/** Achata as seções em uma lista (para a paleta de comandos). */
export function flattenSections(sections: NavSection[]): NavItem[] {
  return sections.flatMap((s) => s.items);
}
