import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { isProfileExpired } from "@/lib/subscription";
import { fetchLibraryItems } from "@/lib/library";
import { Loader2 } from "lucide-react";
import {
  Sparkles,
  Flame,
  Zap,
  TrafficCone,
  Brain,
  Library,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Video,
  ListChecks,
  FileText,
  ExternalLink,
  Play,
  ImageIcon,
  Car,
  Check,
  X,
  RotateCcw,
  Trophy,
  Timer,
  AlertTriangle,
  Info,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: DashboardGate,
  head: () => ({
    meta: [
      { title: "Área do Aluno — Nexia DETRAN" },
      {
        name: "description",
        content: "Prepare-se para a Prova Teórica e o Psicotécnico para passar de primeira.",
      },
    ],
  }),
});

function DashboardGate() {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/cadastro", replace: true });
      } else if (!isAdmin && profile && (profile.status === "pendente_pagamento" || isProfileExpired(profile))) {
        navigate({ to: "/checkout", replace: true });
      }
    }
  }, [user, profile, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!profile && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return <DashboardController />;
}

function DashboardController() {
  const [activeModule, setActiveModule] = useState<"hub" | "teorico" | "psicotecnico" | "direcao">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexia:active_module");
      return (stored as "teorico" | "psicotecnico" | "direcao") || "hub";
    }
    return "hub";
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem("nexia:active_module") as "teorico" | "psicotecnico" | "direcao" | null;
      if (stored && stored !== activeModule) {
        setActiveModule(stored);
      } else if (!stored && activeModule !== "hub") {
        setActiveModule("hub");
      }
    };
    window.addEventListener("nexia:active_module:change", handler);
    return () => window.removeEventListener("nexia:active_module:change", handler);
  }, [activeModule]);

  const selectModule = (mod: "teorico" | "psicotecnico" | "direcao") => {
    setActiveModule(mod);
    localStorage.setItem("nexia:active_module", mod);
    window.dispatchEvent(new Event("nexia:active_module:change"));
  };

  return (
    <AnimatePresence mode="wait">
      {activeModule === "hub" ? (
        <ModuleHub key="hub" onSelect={selectModule} />
      ) : activeModule === "teorico" ? (
        <TeoricoDashboard key="teorico" />
      ) : activeModule === "psicotecnico" ? (
        <PsicotecnicoDashboard key="psico" />
      ) : (
        <DirecaoDashboard key="direcao" />
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 1. HUB SELECTION COMPONENT
// ==========================================
function ModuleHub({ onSelect }: { onSelect: (mod: "teorico" | "psicotecnico" | "direcao") => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 space-y-8 text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute top-[10%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-success/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 max-w-2xl mx-auto"
      >
        <h1 className="text-3xl md:text-5xl font-display font-bold">O que você deseja estudar hoje?</h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          Sua aprovação no DETRAN começa aqui. Selecione o módulo desejado para ver materiais exclusivos, simulados e vídeos explicativos.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
        {/* Module 1: Psicotecnico */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => onSelect("psicotecnico")}
          className="group text-left glass rounded-3xl p-8 border-border/40 hover:border-primary/50 shadow-card hover:shadow-glow cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-glow group-hover:scale-110 transition-transform">
              <Brain className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-foreground leading-tight">
                Prepare-se para o <span className="gradient-text">Psicotécnico</span> 🧠
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Vídeos e testes práticos de memorização, atenção concentrada, raciocínio lógico e o famoso teste dos risquinhos (Palográfico).
              </p>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground pt-2">
              <li className="flex items-center gap-2">✓ Teste Palográfico interativo</li>
              <li className="flex items-center gap-2">✓ Exercícios de Raciocínio Lógico e Atenção</li>
              <li className="flex items-center gap-2">✓ Macetes gravados em vídeo explicativo</li>
            </ul>
          </div>
          <div className="pt-6">
            <div className="w-full py-3.5 px-5 rounded-xl font-bold gradient-primary text-primary-foreground flex items-center justify-center gap-2 shadow-glow group-hover:gap-3 transition-all pointer-events-none">
              Acessar Psicotécnico
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>

        {/* Module 2: Teorico */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onClick={() => onSelect("teorico")}
          className="group text-left glass rounded-3xl p-8 border-border/40 hover:border-red-500/50 shadow-card hover:shadow-red cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <BookOpen className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-foreground leading-tight">
                Prepare-se para a <span className="text-red-500">Parte Teórica</span> 📕
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Estudo focado na prova de legislação do DETRAN. Legislação, Direção Defensiva, Primeiros Socorros, Mecânica Básica e Meio Ambiente.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground pt-2">
              <li className="flex items-center gap-2">✓ Simulados inteligentes com cronômetro</li>
              <li className="flex items-center gap-2">✓ Game interativo para memorizar Placas</li>
              <li className="flex items-center gap-2">✓ Resumos e livrinhos virtuais em PDF</li>
            </ul>
          </div>
          <div className="pt-6">
            <div className="w-full py-3.5 px-5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:gap-3 transition-all pointer-events-none">
              Acessar Parte Teórica
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>

        {/* Module 3: Direcao */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => onSelect("direcao")}
          className="group text-left glass rounded-3xl p-8 border-border/40 hover:border-primary/50 shadow-card hover:shadow-glow cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-glow group-hover:scale-110 transition-transform">
              <TrafficCone className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-foreground leading-tight">
                <span className="gradient-text">Dicas</span> para passar na Direção Prática 🚗
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dicas e macetes para arrasar no exame prático do DETRAN. Manobras, provas de baliza e o que esperar no dia da avaliação.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground pt-2">
              <li className="flex items-center gap-2">✓ O que o examinador avalia</li>
              <li className="flex items-center gap-2">✓ Guia de manobras e baliza</li>
              <li className="flex items-center gap-2">✓ Dicas para não ser reprovado</li>
            </ul>
          </div>
          <div className="pt-6">
            <div className="w-full py-3.5 px-5 rounded-xl font-bold gradient-primary text-primary-foreground flex items-center justify-center gap-2 shadow-glow group-hover:gap-3 transition-all pointer-events-none">
              Acessar Dicas Práticas
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// 2. TEORICO DASHBOARD
// ==========================================
const TEORICO_QUICK = [
  {
    to: "/simulado",
    label: "Simulado Rápido",
    desc: "30 questões inteligentes",
    icon: Sparkles,
    accent: "from-primary to-primary-glow",
  },
  {
    to: "/mais-caem",
    label: "Mais Caem",
    desc: "Foco no que importa",
    icon: Flame,
    accent: "from-destructive to-warning",
  },
  {
    to: "/placas",
    label: "Placas Mais Caem",
    desc: "Treino de sinalização",
    icon: TrafficCone,
    accent: "from-warning to-destructive",
  },
  {
    to: "/turbo",
    label: "Revisão Turbo",
    desc: "Memorize no swipe",
    icon: Zap,
    accent: "from-warning to-warning",
  },
] as const;

function TeoricoDashboard() {
  const { data: libraryItems = [], isLoading: libLoading } = useQuery({
    queryKey: ["library", "teorico-dash"],
    queryFn: () => fetchLibraryItems(false),
  });
  const teoricoItems = libraryItems.filter((i) => i.module_type === "teorico" && !i.is_paid);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-6xl px-4 py-6 md:py-8 space-y-6"
    >
      {/* Hero */}
      <section className="glass rounded-3xl p-6 md:p-8 shadow-card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">
            Módulo Teórico DETRAN
          </p>
          <h1 className="text-2xl md:text-4xl font-display font-bold mt-2 leading-tight">
            Comece sua jornada rumo à <span className="gradient-text">aprovação</span>.
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-3 max-w-lg">
            Estude legislação, direção defensiva, primeiros socorros e faça simulados como na prova real para passar de primeira!
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/simulado"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold shadow-glow hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <Sparkles className="h-4 w-4" />
              Iniciar Primeiro Simulado
            </Link>
            <Link
              to="/turbo"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass text-xs font-semibold hover:bg-accent/30 transition-colors"
            >
              <Zap className="h-4 w-4 text-warning" />
              Revisão Turbo
            </Link>
          </div>
        </div>
      </section>

      {/* Livros e Materiais - BIBLIOTECA em destaque */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-display font-bold flex items-center gap-1.5">
            <Library className="h-4.5 w-4.5 text-primary" />
            Livros e Materiais de Estudo
          </h2>
          <Link
            to="/biblioteca"
            search={{ module_type: "teorico" }}
            className="text-xs text-primary hover:text-primary-glow font-semibold flex items-center gap-1 transition-colors"
          >
            Ver todos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {libLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : teoricoItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teoricoItems.slice(0, 6).map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum material disponível ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Os materiais teóricos aparecerão aqui quando forem cadastrados.</p>
          </div>
        )}
      </section>

      {/* Dicas */}
      <section className="glass rounded-3xl p-5 shadow-card">
        <h2 className="text-base font-display font-bold flex items-center gap-1.5 mb-3">
          <ShieldCheck className="h-4.5 w-4.5 text-success" />
          Dicas para sua aprovação
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">📋 Legislação</p>
            <p>Foque em velocidade máxima, distância de segurança e sinalização.</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">🚑 Primeiros Socorros</p>
            <p>Estude acidente vascular cerebral, parada cardíaca e noções básicas de resgate.</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">🚗 Direção Defensiva</p>
            <p>Atenção a ultrapassagens, prioridade e condições da via.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ==========================================
// 3. PSICOTECNICO DASHBOARD
// ==========================================
function PsicotecnicoDashboard() {
  const { data: libraryItems = [], isLoading: libLoading } = useQuery({
    queryKey: ["library", "psico-dash"],
    queryFn: () => fetchLibraryItems(false),
  });
  const psicoItems = libraryItems.filter(
    (i) => i.module_type === "psicotecnico" && !i.is_paid && !i.title.toLowerCase().includes("palografico") && !i.title.toLowerCase().includes("topografico")
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-6xl px-4 py-6 md:py-8 space-y-6"
    >
      {/* Hero */}
      <section className="glass rounded-3xl p-4 md:p-5 shadow-card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-success/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-1">
            <Brain className="h-3.5 w-3.5" /> Módulo Psicotécnico CNH
          </p>
          <h1 className="text-2xl md:text-4xl font-display font-bold mt-2 leading-tight">
            Perca o medo e domine as pegadinhas do <span className="gradient-text">Psicotécnico</span>.
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
            O exame psicotécnico avalia atenção, memória e comportamento. Treine com nossos simulados interativos oficiais.
          </p>
        </div>
      </section>

      {/* Tests Grid */}
      <section>
        <h2 className="text-base font-display font-bold mb-3">Testes Psicotécnicos Práticos</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <PsicoTestCard 
            title="Atenção Concentrada"
            desc="Encontre os símbolos corretos sob limite de tempo rigoroso."
            emoji="🎯"
            type="atencao"
          />
          <PsicoTestCard 
            title="Memória Rápida"
            desc="Lembre de placas e detalhes em imagens piscadas."
            emoji="🧠"
            type="memoria"
          />
          <PsicoTestCard 
            title="Raciocínio Lógico"
            desc="Descubra a ordem lógica de figuras geométricas."
            emoji="🧩"
            type="logico"
          />
        </div>
      </section>

      {/* Livros e Materiais - fetchados da biblioteca */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-display font-bold flex items-center gap-1.5">
            <Library className="h-4.5 w-4.5 text-primary" />
            Materiais de Estudo Psicotécnico
          </h2>
          <Link
            to="/biblioteca"
            search={{ module_type: "psicotecnico" }}
            className="text-xs text-primary hover:text-primary-glow font-semibold flex items-center gap-1 transition-colors"
          >
            Ver todos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {libLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : psicoItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {psicoItems.slice(0, 6).map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum material disponível ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Os materiais psicotécnicos aparecerão aqui quando forem cadastrados.</p>
          </div>
        )}
      </section>

      {/* Tips and videos section */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-5 shadow-card space-y-4">
          <h3 className="font-display font-bold text-base flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" />
            Dicas Críticas de Sucesso
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success shrink-0 font-bold">✓</span>
              <span><strong>Mantenha a calma:</strong> O examinador avalia desvios bruscos e nervosismo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success shrink-0 font-bold">✓</span>
              <span><strong>Durma bem:</strong> Testes de atenção dependem de sua acuidade física imediata.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success shrink-0 font-bold">✓</span>
              <span><strong>Siga ordens:</strong> A maioria das reprovações acontece por começar antes do comando do instrutor.</span>
            </li>
          </ul>
        </div>

        <div className="glass rounded-3xl p-5 shadow-card space-y-4">
          <h3 className="font-display font-bold text-base flex items-center gap-1.5">
            <Brain className="h-4.5 w-4.5 text-success" />
            O que treinar primeiro
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 font-bold">1.</span>
              <span><strong>Atenção Concentrada:</strong> É o teste mais cobrado e mais reprovado.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 font-bold">2.</span>
              <span><strong>Memória Rápida:</strong> Pratique memorizar objetos e detalhes rapidamente.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 font-bold">3.</span>
              <span><strong>Raciocínio Lógico:</strong> Pratique identificar padrões e sequências de figuras geométricas.</span>
            </li>
          </ul>
        </div>
      </section>
    </motion.div>
  );
}

// ==========================================
// 4. DIREÇÃO PRÁTICA (DASHBOARD LIGHTS SIMULATOR)
// ==========================================
type LightCategory = "perigo" | "atencao" | "info";

type DashboardLight = {
  id: string;
  title: string;
  color: string;
  category: LightCategory;
  description: string;
  action: string;
  options: string[];
  correctIdx: number;
  renderSvg: (color: string) => React.ReactNode;
};

const DASHBOARD_LIGHTS: DashboardLight[] = [
  {
    id: "oil",
    title: "Luz do Óleo do Motor",
    color: "#EF4444",
    category: "perigo",
    description: "Indica que a pressão do óleo lubrificante do motor está perigosamente baixa. As partes móveis do motor podem sofrer atrito direto, levando à destruição completa do bloco.",
    action: "Pare o veículo imediatamente em um local seguro, desligue o motor e verifique a vareta do óleo. Não ligue o carro novamente se o nível estiver abaixo do mínimo ou se a luz persistir acesa. Chame um guincho.",
    options: [
      "Luz do óleo do motor (pressão insuficiente)",
      "Baixo nível de fluido de freio",
      "Luz do filtro de combustível",
      "Temperatura elevada da água"
    ],
    correctIdx: 0,
    renderSvg: (color) => (
      <>
        <path d="M2 16h15a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H7.5L5 6H2v2h2l2 4H2v4z" />
        <path d="M17 10h3.5a1.5 1.5 0 0 1 1.5 1.5V13c0 1.5-1.5 2-3 2" />
        <path d="M22 6c.5.8.5 1.8 0 2.5-.5.7-1.5 1.5-1.5 1.5s-1-.8-1.5-1.5c-.5-.7-.5-1.7 0-2.5.5-.8 1.5-.8 3 0z" fill={color} />
      </>
    )
  },
  {
    id: "battery",
    title: "Luz de Bateria / Alternador",
    color: "#EF4444",
    category: "perigo",
    description: "Indica que o alternador não está gerando carga suficiente para alimentar a rede elétrica e carregar a bateria do carro. O veículo funcionará apenas consumindo a reserva de carga remanescente.",
    action: "Dirija-se imediatamente à autoelétrica ou oficina mais próxima. Desligue todos os itens elétricos não essenciais (ar condicionado, rádio, faróis altos) para economizar energia e evitar que o motor apague no trânsito.",
    options: [
      "Falha no sistema de carga da bateria / alternador",
      "Falha nos fusíveis do motor",
      "Modo de economia de bateria ativo",
      "Falha de faísca nas velas de ignição"
    ],
    correctIdx: 0,
    renderSvg: () => (
      <>
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <rect x="5" y="3" width="4" height="3" />
        <rect x="15" y="3" width="4" height="3" />
        <line x1="6" y1="13" x2="10" y2="13" />
        <line x1="15" y1="13" x2="19" y2="13" />
        <line x1="17" y1="11" x2="17" y2="15" />
      </>
    )
  },
  {
    id: "brake",
    title: "Luz de Freio / Fluido de Freio",
    color: "#EF4444",
    category: "perigo",
    description: "Indica que o freio de mão (estacionamento) está acionado ou que o nível do fluido de freio no reservatório está abaixo do limite de segurança. Isso pode indicar vazamentos e risco de perda de frenagem.",
    action: "Certifique-se de soltar totalmente a alavanca do freio de mão. Se a luz continuar acesa, encoste em local seguro. Baixo nível de fluido indica desgaste extremo das pastilhas ou vazamento. Evite rodar sem freios.",
    options: [
      "Falha no pedal de freio",
      "Freio de mão ativado ou baixo fluido de freio",
      "Falha no sensor do ABS",
      "Desgaste das pastilhas de freio"
    ],
    correctIdx: 1,
    renderSvg: (color) => (
      <>
        <circle cx="12" cy="12" r="6" />
        <path d="M8.5 6a8 8 0 0 0 0 12" />
        <path d="M15.5 6a8 8 0 0 1 0 12" />
        <line x1="12" y1="9" x2="12" y2="12" strokeWidth="2.5" />
        <circle cx="12" cy="15" r="1" fill={color} />
      </>
    )
  },
  {
    id: "temp",
    title: "Luz de Temperatura do Motor",
    color: "#EF4444",
    category: "perigo",
    description: "Indica que a água do radiador (líquido de arrefecimento) atingiu a temperatura máxima tolerável. Continuar dirigindo causará superaquecimento, queimando a junta do cabeçote ou fundindo o motor.",
    action: "Pare o veículo imediatamente na sombra ou em local seguro. Desligue o motor. Aguarde o motor esfriar totalmente (cerca de 30-40 min) antes de abrir a tampa do radiador/reservatório para evitar queimaduras graves por vapor de água quente. Complete a água e procure um mecânico.",
    options: [
      "Pressão do óleo lubrificante baixa",
      "Ar condicionado com falha",
      "Superaquecimento do motor (temperatura crítica)",
      "Reservatório de partida a frio vazio"
    ],
    correctIdx: 2,
    renderSvg: (color) => (
      <>
        <path d="M12 3v12" />
        <path d="M10 5h4M10 8h4M10 11h4" />
        <circle cx="12" cy="17" r="3" fill={color} />
        <path d="M12 14v3" strokeWidth="3" />
        <path d="M4 21h16M6 19c2-1 4-1 6 0s4 1 6 0" />
      </>
    )
  },
  {
    id: "engine",
    title: "Luz de Injeção Eletrônica",
    color: "#F59E0B",
    category: "atencao",
    description: "Alerta sobre falhas nos sensores do sistema de alimentação, ignição ou escape do motor (catalisador e sonda lambda). Pode causar aumento no consumo de combustível, perda de potência ou engasgos.",
    action: "O veículo não precisa parar imediatamente, a menos que surjam ruídos anômalos. Porém, agende uma visita ao mecânico nas próximas horas para rastrear o erro via scanner de injeção eletrônica e evitar agravamento.",
    options: [
      "Nível de óleo baixo",
      "Falha no catalisador de emissões",
      "Falha no sistema de injeção eletrônica / motor",
      "Luz de aviso de revisão vencida"
    ],
    correctIdx: 2,
    renderSvg: () => (
      <>
        <path d="M2 9h3v-2h4v2h8v2h2v4h-2v2h-4v2h-3v-2H6v-2H2V9z" />
        <circle cx="12" cy="13" r="1.5" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="9" y1="6" x2="9" y2="7" />
        <line x1="7" y1="6" x2="7" y2="7" />
      </>
    )
  },
  {
    id: "abs",
    title: "Luz do Freio ABS",
    color: "#F59E0B",
    category: "atencao",
    description: "Indica falha no módulo eletrônico do ABS (sistema antitravamento). Os freios hidráulicos comuns continuam funcionando normalmente, mas as rodas travarão em frenagens abruptas de emergência ou piso molhado.",
    action: "Redobre a atenção ao trafegar em dias chuvosos ou pistas de cascalho. Evite frenagens violentas. Procure uma oficina mecânica para examinar sensores de velocidade das rodas ou cabos elétricos do sistema.",
    options: [
      "Falha no sistema de freios ABS",
      "Fluido de freio com vazamento",
      "Pastilhas de freio gastas",
      "Freio de estacionamento acionado"
    ],
    correctIdx: 0,
    renderSvg: () => (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M3 12a10 10 0 0 1 2.5-6.5" />
        <path d="M3 12a10 10 0 0 0 2.5 6.5" />
        <path d="M21 12a10 10 0 0 0-2.5-6.5" />
        <path d="M21 12a10 10 0 0 1-2.5 6.5" />
        <path d="M8 14v-3.5a1 1 0 0 1 1-1h0.5a1 1 0 0 1 1 1V14" />
        <line x1="8" y1="12.5" x2="10.5" y2="12.5" />
        <path d="M12 9.5h1.5a1 1 0 0 1 1 1v0.5a1 1 0 0 1-1 1H12v2h1.5a1 1 0 0 0 1-1v-0.5a1 1 0 0 0-1-1" />
        <line x1="12" y1="9.5" x2="12" y2="14" />
        <path d="M17.5 10.5a1 1 0 0 0-1-1h-0.8a1 1 0 0 0-1 1v0.8a1 1 0 0 0 1 1h0.8a1 1 0 0 1 1 1v0.8a1 1 0 0 1-1 1h-0.8a1 1 0 0 1-1-1" />
      </>
    )
  },
  {
    id: "tire",
    title: "Luz de Pressão de Pneus (TPMS)",
    color: "#F59E0B",
    category: "atencao",
    description: "Indica perda severa de pressão em pelo menos um dos quatro pneus. Rodar com pneus murchos aumenta a distância de frenagem, o consumo e danifica a lateral do pneu e a roda.",
    action: "Dirija-se ao posto de combustível ou borracharia mais próxima e faça a calibragem correta dos pneus. Se a luz persistir acesa após calibrar e rodar alguns quilômetros, verifique se há furos ou pregos encravados.",
    options: [
      "Pneu furado ou desalinhamento",
      "Falha na suspensão traseira",
      "Controle de tração ativo",
      "Pressão baixa em um ou mais pneus (TPMS)"
    ],
    correctIdx: 3,
    renderSvg: (color) => (
      <>
        <path d="M6 6c-2 1.5-3.5 3.5-3.5 6 0 3 2 4.5 4.5 5h10c2.5-.5 4.5-2 4.5-5 0-2.5-1.5-4.5-3.5-6" />
        <path d="M7 19h10M7 21h2M11 21h2M15 21h2" />
        <line x1="12" y1="9" x2="12" y2="12" strokeWidth="2.5" />
        <circle cx="12" cy="14.5" r="0.8" fill={color} />
      </>
    )
  },
  {
    id: "fuel",
    title: "Luz de Combustível Baixo (Reserva)",
    color: "#F59E0B",
    category: "atencao",
    description: "Avisa que o nível de combustível no tanque entrou na reserva (geralmente restando de 5 a 8 litros). Deixar o combustível acabar gera multa por pane seca no Brasil.",
    action: "Procure o posto de combustível mais próximo para abastecer. Evite rodar muito na reserva para não queimar a bomba de combustível elétrica (que é refrigerada pelo próprio líquido no tanque).",
    options: [
      "Filtro de combustível saturado",
      "Baixo nível de combustível (Reserva)",
      "Vazamento no tanque de gasolina",
      "Válvula de injeção travada"
    ],
    correctIdx: 1,
    renderSvg: (color) => (
      <>
        <rect x="5" y="6" width="10" height="13" rx="1.5" />
        <rect x="7" y="8" width="6" height="4" />
        <path d="M15 9h2.5a1.5 1.5 0 0 1 1.5 1.5v4.5a1 1 0 0 0 2 0v-4" />
        <rect x="18" y="7" width="2" height="2" fill={color} />
        <path d="M4 19h12" />
      </>
    )
  },
  {
    id: "esp",
    title: "Luz do Controle de Estabilidade (ESP)",
    color: "#F59E0B",
    category: "atencao",
    description: "Pisca rapidamente enquanto o controle eletrônico de estabilidade está atuando para frear rodas individualmente e evitar derrapagens. Fica fixa se houver defeito ou se o motorista desativou o sistema manualmente.",
    action: "Se a luz piscar no painel, significa que você está no limite de aderência; reduza a velocidade imediatamente. Se ela ficar acesa direto sem que você tenha desativado, o carro continuará andando, mas sem a proteção antiblocagem lateral.",
    options: [
      "Controle de estabilidade ou tração ativo/com falha",
      "Pista escorregadia detectada",
      "Falha nos amortecedores dianteiros",
      "Freio regenerativo desativado"
    ],
    correctIdx: 0,
    renderSvg: () => (
      <>
        <path d="M9 13h6l1-3h-8z" />
        <circle cx="10" cy="14" r="1.5" />
        <circle cx="14" cy="14" r="1.5" />
        <path d="M6 18c2-2 4 0 6-2s4 2 6 0" />
        <path d="M5 20c3-3 6 1 9-2" />
      </>
    )
  },
  {
    id: "airbag",
    title: "Luz de Falha do Airbag",
    color: "#EF4444",
    category: "perigo",
    description: "Indica que o módulo dos airbags dianteiros ou de cortina identificou um erro elétrico ou falha nos sensores. Em caso de batida, as bolsas de ar podem simplesmente não inflar.",
    action: "Leve o veículo a uma concessionária ou mecânico especializado em eletrônica embarcada para passar o diagnóstico por computador. Trafegar com falha no airbag coloca em risco a vida dos passageiros em acidentes.",
    options: [
      "Alerta de colisão iminente",
      "Cinto de segurança destravado",
      "Airbag de passageiro desativado",
      "Falha no sistema de Airbags"
    ],
    correctIdx: 3,
    renderSvg: () => (
      <>
        <circle cx="9" cy="8" r="2.5" />
        <path d="M4 19c0-3 2.5-5 5-5h1" />
        <circle cx="16" cy="12" r="3.5" strokeDasharray="2 1" />
        <path d="M12.5 14.5l1.5-1" />
        <line x1="4" y1="21" x2="20" y2="21" />
      </>
    )
  },
  {
    id: "seatbelt",
    title: "Luz do Cinto de Segurança",
    color: "#EF4444",
    category: "perigo",
    description: "Alerta visual (acompanhado de som estridente) de que o motorista ou o passageiro dianteiro não afivelaram o cinto de segurança com o carro em movimento.",
    action: "Afivele o cinto de segurança imediatamente. O uso do cinto reduz em até 70% o risco de mortes e lesões graves em colisões, além de ser obrigatório por lei.",
    options: [
      "Motorista ou passageiro sem cinto de segurança",
      "Falha nos sensores de peso do banco",
      "Cadeirinha infantil solta",
      "Pré-tensionador com falha"
    ],
    correctIdx: 0,
    renderSvg: () => (
      <>
        <circle cx="12" cy="7" r="2.5" />
        <path d="M8 13v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6H8z" />
        <path d="M7 21h10" />
        <line x1="7" y1="12" x2="17" y2="19" strokeWidth="3" />
      </>
    )
  },
  {
    id: "highbeam",
    title: "Luz de Farol Alto",
    color: "#3B82F6",
    category: "info",
    description: "Sinaliza ao motorista que os faróis altos estão ligados. Isso auxilia a enxergar rodovias mal iluminadas a longas distâncias, mas cega quem trafega em sentido oposto.",
    action: "Desative o farol alto imediatamente ao avistar qualquer veículo vindo no sentido contrário ou trafegando à sua frente, retornando ao farol baixo.",
    options: [
      "Farol baixo ligado",
      "Farol de neblina ativo",
      "Farol alto ligado",
      "Luzes de rodagem diurna ativas"
    ],
    correctIdx: 2,
    renderSvg: () => (
      <>
        <path d="M10 6h4a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-4V6z" />
        <line x1="3" y1="9" x2="7" y2="9" strokeWidth="2.5" />
        <line x1="3" y1="12" x2="7" y2="12" strokeWidth="2.5" />
        <line x1="3" y1="15" x2="7" y2="15" strokeWidth="2.5" />
        <path d="M10 6v12" />
      </>
    )
  },
  {
    id: "foglight",
    title: "Farol de Neblina Dianteiro",
    color: "#10B981",
    category: "info",
    description: "Indica que o conjunto de luzes de neblina dianteiras está ativo. Elas iluminam o asfalto logo à frente e as faixas laterais para ajudar em nevoeiros densos.",
    action: "Mantenha ligado apenas em situações climáticas de neblina, chuva forte ou poeira excessiva, desligando em noites normais para não saturar a bateria.",
    options: [
      "Farol de neblina dianteiro ligado",
      "Luzes indicadoras de direção",
      "Farol baixo ligado",
      "Lanterna traseira de neblina ligada"
    ],
    correctIdx: 0,
    renderSvg: () => (
      <>
        <path d="M12 6h2a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-2V6z" />
        <line x1="4" y1="10" x2="8" y2="8" strokeWidth="2" />
        <line x1="4" y1="13" x2="8" y2="11" strokeWidth="2" />
        <line x1="4" y1="16" x2="8" y2="14" strokeWidth="2" />
        <path d="M6 7c0 3-1 5-1 8s1 5 1 8" strokeWidth="1.5" />
      </>
    )
  },
  {
    id: "cruise",
    title: "Piloto Automático (Cruise Control)",
    color: "#10B981",
    category: "info",
    description: "Confirma que o Cruise Control está ativado, permitindo que o carro mantenha a velocidade programada pelo condutor automaticamente, sem precisar pisar no acelerador.",
    action: "Utilize preferencialmente em rodovias livres e duplicadas. Toque no pedal do freio ou da embreagem para desligar instantaneamente o piloto automático em caso de tráfego ou perigo.",
    options: [
      "Limitador de velocidade ativo",
      "Direção hidráulica com falha",
      "Piloto automático (Cruise Control) ativado",
      "Controle de arrancada ativo"
    ],
    correctIdx: 2,
    renderSvg: (color) => (
      <>
        <path d="M20 12a8 8 0 1 0-16 0" />
        <circle cx="12" cy="12" r="1" fill={color} />
        <line x1="12" y1="12" x2="16" y2="8" strokeWidth="2" />
        <path d="M6 8l1.5 1.5M18 8l-1.5 1.5M12 5V3" />
      </>
    )
  }
];

function LightIconRenderer({
  id,
  color,
  className = "w-12 h-12",
}: {
  id: string;
  color: string;
  className?: string;
}) {
  const light = DASHBOARD_LIGHTS.find((l) => l.id === id);
  if (!light) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {light.renderSvg(color)}
    </svg>
  );
}

function DirecaoDashboard() {
  const [activeSubModule, setActiveSubModule] = useState<"hub" | "luzes" | "baliza" | "checklist">("hub");

  // Fetch library items for 'direcao' module type (Módulo Prático)
  const { data: libraryItems = [], isLoading: libLoading } = useQuery({
    queryKey: ["library", "direcao-dash"],
    queryFn: () => fetchLibraryItems(false),
  });
  const direcaoItems = libraryItems.filter((i) => i.module_type === "direcao" && !i.is_paid);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {activeSubModule === "hub" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Header */}
          <section className="glass rounded-3xl p-6 md:p-8 shadow-card relative overflow-hidden bg-[#0A0D18]/90 border border-zinc-800">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-primary-glow font-bold flex items-center gap-1.5">
                <Car className="h-4 w-4" /> Módulo Prático de Direção
              </p>
              <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight">
                Prepare-se para o <span className="gradient-text">Exame Prático</span> 🚗
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Estude os comandos do painel do carro, visualize as etapas passo a passo da baliza ideal e consulte o checklist do examinador do DETRAN para evitar perda de pontos!
              </p>
            </div>
          </section>

          {/* Sub-modules menu cards grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Luzes do Painel */}
            <div
              onClick={() => setActiveSubModule("luzes")}
              className="group glass rounded-3xl p-6 border border-border/40 hover:border-primary/50 shadow-card hover:shadow-glow cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-glow group-hover:scale-115 transition-transform">
                  <Timer className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Luzes do Painel</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Simulador com 14 símbolos e avisos luminosos do painel do veículo.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold gradient-primary text-primary-foreground flex items-center justify-center gap-2 pointer-events-none">
                  Acessar Simulador
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Card 2: Guia de Baliza */}
            <div
              onClick={() => setActiveSubModule("baliza")}
              className="group glass rounded-3xl p-6 border border-border/40 hover:border-primary/50 shadow-card hover:shadow-glow cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-glow group-hover:scale-115 transition-transform">
                  <TrafficCone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Guia de Baliza & Manobras</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Passo a passo interativo de 3 pontos para alinhar e estacionar sem erros.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold gradient-primary text-primary-foreground flex items-center justify-center gap-2 pointer-events-none">
                  Ver Guia Prático
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Card 3: Checklist do Exame */}
            <div
              onClick={() => setActiveSubModule("checklist")}
              className="group glass rounded-3xl p-6 border border-border/40 hover:border-primary/50 shadow-card hover:shadow-glow cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-glow group-hover:scale-115 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Checklist do Exame DETRAN</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lista oficial de infrações e pontuações do exame prático de direção.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold gradient-primary text-primary-foreground flex items-center justify-center gap-2 pointer-events-none">
                  Acessar Checklist
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </section>

          {/* Livros e Materiais de Apoio - pull from library */}
          <section className="space-y-4 pt-4 border-t border-border/20">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-bold flex items-center gap-2">
                <Library className="h-4.5 w-4.5 text-primary" />
                Materiais de Estudo de Direção
              </h2>
              <Link
                to="/biblioteca"
                search={{ module_type: "direcao" }}
                className="text-xs text-primary hover:text-primary-glow font-semibold flex items-center gap-1 transition-colors"
              >
                Ver tudo na biblioteca <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {libLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : direcaoItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {direcaoItems.map((item) => (
                  <LibraryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 text-center border border-border/10">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum material de direção disponível ainda.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Envie imagens ou PDFs na biblioteca do painel admin para mostrá-los aqui.</p>
              </div>
            )}
          </section>
        </motion.div>
      )}

      {/* Warning Lights Simulator Component View */}
      {activeSubModule === "luzes" && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveSubModule("hub")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
          >
            ← Voltar ao Menu Prático
          </button>
          <PanelLightsMainView />
        </div>
      )}

      {/* Baliza Step-by-Step Guide View */}
      {activeSubModule === "baliza" && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveSubModule("hub")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
          >
            ← Voltar ao Menu Prático
          </button>
          <BalizaGuide />
        </div>
      )}

      {/* Practical Exam Points Checklist View */}
      {activeSubModule === "checklist" && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveSubModule("hub")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
          >
            ← Voltar ao Menu Prático
          </button>
          <ExamChecklist />
        </div>
      )}
    </div>
  );
}

function PanelLightsMainView() {
  const [tab, setTab] = useState<"learn" | "quiz">("learn");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Hero Header */}
      <section className="glass rounded-3xl p-6 md:p-8 shadow-card relative overflow-hidden bg-[#0A0D18]/90 border border-zinc-800">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <p className="text-xs uppercase tracking-widest text-primary-glow font-bold flex items-center gap-1.5">
              <Car className="h-4 w-4" /> Módulo Prático de Direção
            </p>
            <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight">
              Simulador de <span className="gradient-text">Luzes do Painel</span> 🚗
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Decore todos os símbolos e avisos luminosos do painel do veículo para garantir a pontuação em mecânica do DETRAN e dirigir com total segurança.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-2xl bg-black/40 border border-border/30 shadow-inner">
            <button
              onClick={() => setTab("learn")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === "learn"
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📖 Aprender (Painel)
            </button>
            <button
              onClick={() => setTab("quiz")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === "quiz"
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🎯 Treinar (Simulado)
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Tab view */}
      <AnimatePresence mode="wait">
        {tab === "learn" ? (
          <PanelLightsStudy key="learn" />
        ) : (
          <PanelLightsQuiz key="quiz" />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const BALIZA_STEPS = [
  {
    step: 1,
    title: "Alinhamento e Seta",
    desc: "Aproxime seu carro paralelamente ao veículo da frente (ou estacas de baliza). Pare com o para-choque traseiro alinhado com a traseira do outro veículo, guardando uma distância lateral de aproximadamente 50 cm. Ligue a seta para a direita e engate a marcha ré.",
    tip: "Pegadinha comum: Esquecer de ligar a seta antes de começar a se movimentar é uma falta grave que tira 3 pontos!"
  },
  {
    step: 2,
    title: "Giro e Entrada (O ponto da diagonal)",
    desc: "Gire o volante totalmente para a direita. Ande lentamente de ré até visualizar, no espelho retrovisor esquerdo, a estaca/farol direito do carro que está posicionado logo atrás de você na vaga.",
    tip: "Mantenha a embreagem bem controlada e o pé próximo ao pedal de freio para mover o veículo com precisão milimétrica."
  },
  {
    step: 3,
    title: "Alinhamento e Giro Inverso",
    desc: "Agora, centralize o volante e dê ré em linha reta até que a coluna dianteira direita do seu carro (perto do retrovisor direito) passe livre pela traseira/estaca do veículo da frente. Em seguida, gire o volante totalmente para a esquerda e continue a ré lentamente.",
    tip: "Atenção: encostar ou esbarrar nas estacas delimitadoras de vaga (cones) é falta eliminatória que reprova o candidato na hora!"
  },
  {
    step: 4,
    title: "Centralização e Finalização",
    desc: "Coloque a primeira marcha, centralize a direção do volante e ande um pouco para a frente para alinhar o carro perfeitamente no centro da vaga, guardando distância igual do carro da frente e de trás. Puxe o freio de mão e coloque em ponto morto.",
    tip: "Não encoste no meio-fio! Bater a roda com força ou subir na calçada desqualifica o candidato automaticamente."
  }
];

function BalizaGuide() {
  const [currStep, setCurrStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 md:p-8 border border-border/25 shadow-glow space-y-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between border-b border-border/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <TrafficCone className="h-5 w-5 text-primary-glow" />
            Passo a Passo da Baliza Perfeita
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            O método de alinhamento em 3 pontos mais eficaz para passar no DETRAN.
          </p>
        </div>
        <span className="text-xs font-bold bg-primary/10 border border-primary/20 text-primary-glow px-3 py-1 rounded-full">
          Passo {currStep + 1} de {BALIZA_STEPS.length}
        </span>
      </div>

      {/* Active step display */}
      <div className="space-y-4 py-2">
        <h3 className="text-lg font-bold font-display flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-glow">
            {BALIZA_STEPS[currStep].step}
          </span>
          {BALIZA_STEPS[currStep].title}
        </h3>
        
        <p className="text-xs md:text-sm text-foreground/90 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
          {BALIZA_STEPS[currStep].desc}
        </p>

        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">💡 Macete & Pegadinha:</p>
            <p className="leading-relaxed">{BALIZA_STEPS[currStep].tip}</p>
          </div>
        </div>
      </div>

      {/* Navigation actions */}
      <div className="flex justify-between items-center gap-3 pt-4 border-t border-border/10">
        <button
          onClick={() => setCurrStep(s => Math.max(0, s - 1))}
          disabled={currStep === 0}
          className="px-4 py-2.5 rounded-xl border border-border/40 text-xs font-bold hover:bg-secondary/40 disabled:opacity-40 transition-all cursor-pointer"
        >
          Anterior
        </button>

        <div className="flex gap-1">
          {BALIZA_STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currStep ? "bg-primary" : "bg-zinc-700"}`}
            />
          ))}
        </div>

        {currStep + 1 < BALIZA_STEPS.length ? (
          <button
            onClick={() => setCurrStep(s => Math.min(BALIZA_STEPS.length - 1, s + 1))}
            className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold shadow-glow flex items-center gap-1 cursor-pointer"
          >
            Próximo passo
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrStep(0)}
            className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold shadow-glow flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar Guia
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface ChecklistGroup {
  title: string;
  desc: string;
  points: string;
  items: string[];
}

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    title: "Faltas Eliminatórias",
    desc: "Geram desclassificação imediata e encerramento da prova.",
    points: "Reprovação Direta",
    items: [
      "Avançar sobre o meio-fio ou calçadas da via transversal.",
      "Esbarrar ou derrubar os cones/estacas delimitadoras da baliza.",
      "Não colocar o veículo na vaga de baliza dentro do limite de tempo regulamentado (geralmente 3 tentativas ou 5 minutos).",
      "Não parar o carro diante de uma placa de Parada Obrigatória (R-1) ou semáforo vermelho.",
      "Desobedecer as ordens do examinador de trânsito.",
      "Transitar na contramão de direção da pista de prova."
    ]
  },
  {
    title: "Faltas Graves",
    desc: "Cada ocorrência penaliza o candidato com 3 pontos.",
    points: "-3 Pontos",
    items: [
      "Esquecer de acionar a luz indicadora de direção (seta) antes de qualquer mudança de faixa, curvas ou início da baliza.",
      "Deixar de usar o cinto de segurança (motorista e passageiro/examinador).",
      "Não ajustar os espelhos retrovisores antes de dar partida no motor.",
      "Fazer curvas com velocidade excessiva ou incompatível com a via.",
      "Desengrenar o veículo nas descidas (deixar em ponto morto/banguela)."
    ]
  },
  {
    title: "Faltas Médias",
    desc: "Cada ocorrência penaliza o candidato com 2 pontos.",
    points: "-2 Pontos",
    items: [
      "Deixar o motor morrer (interromper o funcionamento) com o carro em movimento.",
      "Esquecer de soltar o freio de mão completamente antes de iniciar a marcha.",
      "Usar incorretamente as marchas ao longo da prova (ex: tentar sair de segunda marcha).",
      "Dar partida no motor com as marchas engatadas e sem pisar na embreagem.",
      "Não sinalizar corretamente com os braços quando exigido."
    ]
  },
  {
    title: "Faltas Leves",
    desc: "Cada ocorrência penaliza o candidato com 1 ponto.",
    points: "-1 Ponto",
    items: [
      "Negligenciar o controle de embreagem ao arrancar em ladeiras (deixar o carro voltar um pouco antes de subir).",
      "Apoiar o pé no pedal da embreagem enquanto o carro está em movimento (sem necessidade de trocar de marcha).",
      "Apoiar as mãos no câmbio de marchas constantemente sem necessidade.",
      "Regular incorretamente a distância do banco do motorista."
    ]
  }
];

function ExamChecklist() {
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 md:p-8 border border-border/25 shadow-glow space-y-6 max-w-3xl mx-auto"
    >
      <div>
        <h2 className="text-xl font-bold font-display flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary-glow" />
          Faltas do Exame Prático (DETRAN)
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Você pode perder no máximo 3 pontos no total para ser aprovado. Evite estas infrações comuns.
        </p>
      </div>

      {/* Tabs selector */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-black/40 border border-border/30 overflow-x-auto select-none">
        {CHECKLIST_GROUPS.map((g, idx) => (
          <button
            key={idx}
            onClick={() => setActiveGroup(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              idx === activeGroup
                ? g.points.includes("Reprovação")
                  ? "bg-destructive text-destructive-foreground shadow-glow"
                  : "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.title}
          </button>
        ))}
      </div>

      {/* List content */}
      <div className="space-y-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-sm text-foreground">{CHECKLIST_GROUPS[activeGroup].title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{CHECKLIST_GROUPS[activeGroup].desc}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            CHECKLIST_GROUPS[activeGroup].points.includes("Reprovação")
              ? "bg-destructive/15 border-destructive/30 text-destructive-glow"
              : "bg-primary/10 border-primary/20 text-primary-glow"
          }`}>
            {CHECKLIST_GROUPS[activeGroup].points}
          </span>
        </div>

        <ul className="space-y-2">
          {CHECKLIST_GROUPS[activeGroup].items.map((item, idx) => (
            <li
              key={idx}
              className="text-xs md:text-sm flex items-start gap-2.5 p-3.5 rounded-2xl bg-secondary/35 border border-border/10 hover:border-border/30 transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                CHECKLIST_GROUPS[activeGroup].points.includes("Reprovação") ? "bg-red-500" : "bg-primary"
              }`} />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ---------------- STUDY MODE ----------------
function PanelLightsStudy() {
  const [filter, setFilter] = useState<"all" | LightCategory>("all");
  const [selectedLight, setSelectedLight] = useState<DashboardLight | null>(null);

  const filteredLights = useMemo(() => {
    if (filter === "all") return DASHBOARD_LIGHTS;
    return DASHBOARD_LIGHTS.filter((l) => l.category === filter);
  }, [filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Category selector */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            filter === "all"
              ? "bg-zinc-800 border-zinc-700 text-foreground"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-foreground"
          }`}
        >
          Todas as Luzes ({DASHBOARD_LIGHTS.length})
        </button>
        <button
          onClick={() => setFilter("perigo")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            filter === "perigo"
              ? "bg-destructive/20 border-destructive/40 text-destructive-glow"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-destructive-glow"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Perigo / Vermelhas ({DASHBOARD_LIGHTS.filter((l) => l.category === "perigo").length})
        </button>
        <button
          onClick={() => setFilter("atencao")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            filter === "atencao"
              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-amber-400"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Atenção / Amarelas ({DASHBOARD_LIGHTS.filter((l) => l.category === "atencao").length})
        </button>
        <button
          onClick={() => setFilter("info")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            filter === "info"
              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-blue-400"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Informativas / Verde-Azul ({DASHBOARD_LIGHTS.filter((l) => l.category === "info").length})
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredLights.map((light) => {
          // Define shadows based on color
          const glowColor =
            light.color === "#EF4444"
              ? "hover:border-destructive/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
              : light.color === "#F59E0B"
                ? "hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                : "hover:border-primary/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]";

          return (
            <button
              key={light.id}
              onClick={() => setSelectedLight(light)}
              className={`glass rounded-2xl p-5 flex flex-col items-center justify-between gap-4 text-center cursor-pointer transition-all border border-border/30 bg-[#0E101B]/80 ${glowColor}`}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center bg-black/40 border border-zinc-800/80 transition-transform group-hover:scale-105"
                style={{
                  boxShadow: `inset 0 0 10px rgba(0,0,0,0.6), 0 0 8px ${light.color}15`,
                }}
              >
                <LightIconRenderer id={light.id} color={light.color} className="w-9 h-9" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-foreground tracking-wide leading-snug">
                  {light.title}
                </h3>
                <span
                  className="inline-block mt-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${light.color}15`,
                    color: light.color,
                    border: `1px solid ${light.color}30`,
                  }}
                >
                  {light.category === "perigo"
                    ? "Perigo"
                    : light.category === "atencao"
                      ? "Atenção"
                      : "Info"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Light detail Modal Overlay */}
      {selectedLight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-lg w-full rounded-3xl p-6 relative overflow-hidden border border-zinc-800 bg-[#0C0F1A]"
          >
            {/* Top Close button */}
            <button
              onClick={() => setSelectedLight(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Glowing Icon Bezel */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center bg-black/50 border border-zinc-800 shadow-inner relative"
                style={{
                  boxShadow: `0 0 25px ${selectedLight.color}25, inset 0 0 15px rgba(0,0,0,0.8)`,
                }}
              >
                <LightIconRenderer id={selectedLight.id} color={selectedLight.color} className="w-11 h-11" />
              </div>

              {/* Title & Severity Badge */}
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-display">{selectedLight.title}</h2>
                <div className="flex justify-center">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${selectedLight.color}15`,
                      color: selectedLight.color,
                      borderColor: `${selectedLight.color}35`,
                    }}
                  >
                    {selectedLight.category === "perigo" && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {selectedLight.category === "perigo"
                      ? "Gravidade: Perigo (Pare o veículo)"
                      : selectedLight.category === "atencao"
                        ? "Gravidade: Atenção (Verifique logo)"
                        : "Gravidade: Informativa (Sistema ativo)"}
                  </span>
                </div>
              </div>

              {/* Information body */}
              <div className="w-full text-left space-y-4 pt-2">
                <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Significado
                  </h4>
                  <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {selectedLight.description}
                  </p>
                </div>

                <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Ação Recomendada
                  </h4>
                  <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {selectedLight.action}
                  </p>
                </div>
              </div>

              {/* Primary action */}
              <button
                onClick={() => setSelectedLight(null)}
                className="w-full py-3.5 rounded-xl font-bold gradient-primary text-primary-foreground text-xs shadow-glow transition-all cursor-pointer"
              >
                Entendi, Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ---------------- QUIZ / SIMULADO MODE ----------------
const shuffleArray = <T,>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

function PanelLightsQuiz() {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [quizKey, setQuizKey] = useState(0);

  // Quiz state
  const [questions, setQuestions] = useState<DashboardLight[]>([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<{ light: DashboardLight; correct: boolean; pickedIdx: number }[]>([]);

  // Timer
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const startQuiz = () => {
    const randomized = shuffleArray(DASHBOARD_LIGHTS).slice(0, 10);
    setQuestions(randomized);
    setCurrIdx(0);
    setScore(0);
    setPickedIdx(null);
    setHistory([]);
    setSeconds(0);
    setPhase("playing");
    setTimerActive(true);
  };

  const handlePick = (idx: number) => {
    if (pickedIdx !== null) return;
    setPickedIdx(idx);
    const q = questions[currIdx];
    const isCorrect = idx === q.correctIdx;
    if (isCorrect) setScore((s) => s + 1);

    setHistory((prev) => [
      ...prev,
      {
        light: q,
        correct: isCorrect,
        pickedIdx: idx,
      },
    ]);
  };

  const nextQuestion = () => {
    if (currIdx + 1 >= questions.length) {
      setTimerActive(false);
      setPhase("result");
    } else {
      setCurrIdx((i) => i + 1);
      setPickedIdx(null);
    }
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl mx-auto"
    >
      {/* 1. INTRO SCREEN */}
      {phase === "intro" && (
        <div className="glass rounded-3xl p-6 md:p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-glow">
            <Trophy className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-display font-bold">Simulado de Luzes do Painel</h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Você responderá a **10 questões** de múltipla escolha sobre os símbolos luminosos do painel do carro. O limite de aprovação é de **70%** (7 acertos).
            </p>
          </div>

          <div className="bg-secondary/30 rounded-2xl border border-border/20 p-4 text-left max-w-md mx-auto space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" /> Regras do Exercício
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Cada luz possui 4 alternativas e apenas 1 correta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>O cronômetro registrará seu tempo de resposta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Ao fim, você poderá revisar quais luzes errou.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            className="w-full max-w-sm py-4 rounded-xl font-bold gradient-primary text-primary-foreground text-sm shadow-glow flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-4 h-4" /> Iniciar Treino
          </button>
        </div>
      )}

      {/* 2. PLAYING SCREEN */}
      {phase === "playing" && currentQuestion && (
        <div className="space-y-6">
          {/* Header Progress and Timer */}
          <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-2xl border border-border/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Progresso:</span>
              <span className="text-xs font-bold bg-primary/20 text-primary-glow px-2.5 py-1 rounded-md border border-primary/30">
                {currIdx + 1} / {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <Timer className="w-4 h-4 text-primary-glow animate-pulse" />
              <span>{formatTime(seconds)}</span>
            </div>
          </div>

          {/* Core Panel Interface */}
          <div className="grid md:grid-cols-2 gap-6 bg-[#090C15]/95 border border-zinc-800/80 rounded-3xl p-6 relative shadow-2xl">
            {/* Left Bezel Instrument Panel */}
            <div className="flex flex-col items-center justify-center py-8 rounded-2xl bg-black/60 border border-zinc-900 shadow-inner relative overflow-hidden aspect-square md:aspect-auto min-h-[220px]">
              {/* Tech Circular Gauge Lines */}
              <div className="absolute w-[200px] h-[200px] rounded-full border border-zinc-900/40 pointer-events-none" />
              <div className="absolute w-[160px] h-[160px] rounded-full border border-dashed border-zinc-800/20 pointer-events-none" />

              {/* Central warning light glowing */}
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0.3, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-full flex items-center justify-center bg-black/30 border border-zinc-800 shadow-inner relative"
                style={{
                  boxShadow: `0 0 45px ${currentQuestion.color}25, inset 0 0 15px rgba(0,0,0,0.85)`,
                }}
              >
                <LightIconRenderer id={currentQuestion.id} color={currentQuestion.color} className="w-12 h-12" />
              </motion.div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mt-4">
                Sinalizador Ativo
              </span>
            </div>

            {/* Right side Question and Options */}
            <div className="flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-primary-glow">
                  Identificação de Painel
                </span>
                <h3 className="text-lg font-bold leading-snug">
                  Qual o significado desta luz acesa no painel do carro?
                </h3>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isPicked = pickedIdx !== null;
                  const isCorrect = idx === currentQuestion.correctIdx;
                  const isUserPick = idx === pickedIdx;

                  let btnStyle = "bg-secondary/30 border-border/20 text-foreground/90 hover:bg-white/5";
                  if (isPicked) {
                    if (isCorrect) {
                      btnStyle = "bg-success/20 border-success/60 text-success-glow shadow-success-glow";
                    } else if (isUserPick) {
                      btnStyle = "bg-destructive/20 border-destructive/60 text-destructive-glow shadow-destructive-glow";
                    } else {
                      btnStyle = "bg-zinc-950/40 border-border/10 text-muted-foreground opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isPicked}
                      onClick={() => handlePick(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold leading-relaxed transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span>{opt}</span>
                        {isPicked && isCorrect && <Check className="w-4 h-4 shrink-0 text-success" />}
                        {isPicked && isUserPick && !isCorrect && <X className="w-4 h-4 shrink-0 text-destructive" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Explanation and Action buttons */}
          <AnimatePresence>
            {pickedIdx !== null && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-5 border border-zinc-800 space-y-4 bg-[#0A0C16]"
              >
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    {pickedIdx === currentQuestion.correctIdx ? (
                      <span className="text-success-glow flex items-center gap-1">
                        <Check className="w-4 h-4" /> Resposta Correta!
                      </span>
                    ) : (
                      <span className="text-destructive-glow flex items-center gap-1">
                        <X className="w-4 h-4" /> Resposta Incorreta!
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    <strong>Explicação:</strong> {currentQuestion.description}
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    <strong>Ação ao acender:</strong> {currentQuestion.action}
                  </p>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full py-3 px-5 rounded-xl font-bold gradient-primary text-primary-foreground text-xs shadow-glow flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
                >
                  {currIdx + 1 >= questions.length ? "Ver Resultados" : "Próxima Questão"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. RESULT SCREEN */}
      {phase === "result" && (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 md:p-8 text-center space-y-6 bg-[#0E111C]">
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold font-display">Simulado Finalizado!</h2>
              <p className="text-xs text-muted-foreground">Veja abaixo o resumo da sua avaliação prática.</p>
            </div>

            {/* Score circle metrics */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-secondary/20 border border-border/10 p-4 rounded-2xl text-center">
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                  Pontuação
                </span>
                <p className="text-2xl font-black mt-1 text-primary-glow">{score} / {questions.length}</p>
              </div>
              <div className="bg-secondary/20 border border-border/10 p-4 rounded-2xl text-center">
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                  Tempo Gasto
                </span>
                <p className="text-2xl font-black mt-1 text-foreground">{formatTime(seconds)}</p>
              </div>
            </div>

            {/* Approval badge */}
            <div className="flex justify-center pt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                  score >= 7
                    ? "bg-success/20 border-success/40 text-success-glow shadow-success-glow animate-pulse"
                    : "bg-destructive/20 border-destructive/40 text-destructive-glow shadow-destructive-glow"
                }`}
              >
                {score >= 7 ? (
                  <>
                    <Check className="w-4 h-4" /> Aprovado (Apto)
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" /> Reprovado (Inapto)
                  </>
                )}
              </span>
            </div>

            <div className="flex gap-2 justify-center max-w-sm mx-auto">
              <button
                onClick={startQuiz}
                className="flex-1 py-3 px-5 rounded-xl font-bold gradient-primary text-primary-foreground text-xs shadow-glow flex items-center justify-center gap-1.5 hover:scale-[1.02] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Refazer Simulado
              </button>
              <button
                onClick={() => setPhase("intro")}
                className="flex-1 py-3 px-5 rounded-xl font-semibold glass text-xs text-foreground hover:bg-white/5 cursor-pointer"
              >
                Voltar ao Início
              </button>
            </div>
          </div>

          {/* Question Review Log */}
          <div className="glass rounded-3xl p-5 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              📋 Revisão das Questões
            </h3>

            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-secondary/25 border border-border/10 text-left"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Bezel circle indicator */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 border border-zinc-800 shadow-inner"
                      style={{ boxShadow: `0 0 10px ${item.light.color}15` }}
                    >
                      <LightIconRenderer id={item.light.id} color={item.light.color} className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-tight">
                        {item.light.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 max-w-md line-clamp-1">
                        Sua resposta: {item.light.options[item.pickedIdx]}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.correct
                        ? "bg-success/10 text-success-glow border border-success/20"
                        : "bg-destructive/10 text-destructive-glow border border-destructive/20"
                    }`}
                  >
                    {item.correct ? "Acertou" : "Errou"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function LibraryCard({ item }: { item: { id: string; title: string; description: string | null; item_type: string; url: string; cover_url: string | null } }) {
  const isVideo = item.item_type === "video";
  const isImage = item.item_type === "image";
  const Icon = isImage ? ImageIcon : isVideo ? Play : item.item_type === "pdf" ? BookOpen : item.item_type === "heyzine" ? FileText : ExternalLink;
  const typeLabel = isImage ? "Imagem" : isVideo ? "Vídeo" : item.item_type === "pdf" ? "Livrinho" : item.item_type === "heyzine" ? "Flipbook" : "Link";

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group glass rounded-2xl overflow-hidden hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow cursor-pointer"
    >
      <div className="aspect-[16/9] relative bg-gradient-to-br from-primary/15 to-primary-glow/15 overflow-hidden">
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="h-10 w-10 text-primary/40" />
          </div>
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}
        {isImage && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md glass text-[10px] font-medium">
          {typeLabel}
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-foreground leading-tight">{item.title}</h3>
        {item.description && (
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        )}
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-primary group-hover:gap-1.5 transition-all">
          Abrir <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

function PsicoTestCard({ title, desc, emoji, type }: { title: string; desc: string; emoji: string; type: string }) {
  return (
    <Link
      to="/psicotecnico"
      className="block glass rounded-2xl p-5 border-border/10 hover:border-success/30 hover:bg-accent/15 transition-all text-left space-y-3"
    >
      <div className="text-2xl">{emoji}</div>
      <div>
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="text-[10px] text-success font-semibold flex items-center gap-0.5 pt-1">
        Treinar Agora <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-display font-bold">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
