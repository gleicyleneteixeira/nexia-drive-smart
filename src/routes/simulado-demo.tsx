import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { isProfileExpired } from "@/lib/subscription";
import { AnimatePresence, motion } from "framer-motion";
import {
  getRandomizedQuestions,
  INCIDENCE_META,
  CATEGORY_LABELS,
  type Question,
  type Category,
  QUESTIONS,
} from "@/data/questions";
import {
  Check,
  X,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  Scale,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Brain,
  Sparkles,
  ListChecks,
  Loader2,
} from "lucide-react";
import { Placa } from "@/components/Placa";
import { triggerRatingPrompt } from "@/components/RatingPrompt";

export const Route = createFileRoute("/simulado-demo")({
  component: SimuladoDemoPage,
  head: () => ({
    meta: [
      { title: "Simulado Inteligente — Nexia DETRAN" },
      {
        name: "description",
        content:
          "Simulado dinâmico com questões que rotacionam e priorizam o que mais cai no DETRAN.",
      },
    ],
  }),
});

const TOTAL = 30;
const STORAGE_KEY = "nexia:simulado:v3";
const SEEN_KEY = "nexia:simulado:seen:v1";

function loadSeen(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function saveSeen(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {}
}
function buildFresh(questionsList: Question[], category?: Category, count: number = TOTAL): Question[] {
  const seen = loadSeen();
  const fresh = category
    ? getRandomizedQuestions(count, { exclude: seen, categories: [category], questionsList })
    : getRandomizedQuestions(count, { exclude: seen, placasCount: 3, questionsList });
  const newSeen = Array.from(new Set([...seen, ...fresh.map((q) => q.id)]));
  saveSeen(newSeen);
  return fresh;
}

interface PersistedState {
  questions: Question[];
  index: number;
  selected: number | null;
  answers: (number | null)[]; // index escolhido por questão
  startedAt: number;
  mode?: "completo" | Category;
}

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.questions?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ---------- Gancho de memória: fallback automático quando a questão não traz um pronto ----------
const CATEGORY_HOOKS: Record<Category, string> = {
  legislacao: "Pense na sigla CTB → Código de Trânsito Brasileiro: toda regra nasce de um artigo. Ligue a resposta a uma imagem de placa + número do artigo.",
  placas: "Formato + cor = função. Triângulo amarelo → advertência (avisa). Círculo vermelho → proibição (proíbe). Retângulo azul → indicação (informa).",
  "direcao-defensiva": "Regra do 3S: Ver, Prever, Rever. Antes de agir, olhe, imagine o pior cenário e confira de novo. A resposta certa quase sempre é a mais cautelosa.",
  "primeiros-socorros": "Prioridade PAS: Proteger, Avisar, Socorrer — nessa ordem. Nunca movimente vítima com suspeita de fratura na coluna.",
  infracoes: "Ligue à mão: 3 pontos (leve), 4 (média), 5 (grave), 7 (gravíssima). Multiplicador só aparece em gravíssimas 'especiais' (álcool, racha, celular).",
  "meio-ambiente": "Poluir = punir. Fumaça preta, buzina desnecessária e descarte irregular caem como infração ambiental. Associe à imagem de um cano soltando fumaça.",
  mecanica: "Antes de girar a chave, faça o 'ABC': Água (radiador), Bateria e Combustível. Pneu e óleo entram no check semanal.",
  prioridade: "Ordem de prioridade em cruzamento sem sinalização: 1) veículo na rotatória; 2) trilhos (trem/VLT); 3) quem vem pela direita.",
};

function getMemoryHook(q: Question): string {
  if (q.memoryHook) return q.memoryHook;
  if (q.tip) return q.tip;
  return CATEGORY_HOOKS[q.category];
}

function SimuladoDemoPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  const isTrial = true;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const dbQuestions = QUESTIONS;

  // Dispara pedido de avaliação 2s após terminar o simulado
  useEffect(() => {
    if (!showResult || isTrial) return;
    const t = setTimeout(() => triggerRatingPrompt("simulado-done"), 2000);
    return () => clearTimeout(t);
  }, [showResult, isTrial]);

  // Hidrata estado a partir do localStorage
  useEffect(() => {
    const persisted = loadPersisted();
    if (isTrial) {
      clearPersisted();
      const trialIds = ["qe60", "qe04", "qe39", "qe11", "qe74", "qe75", "q6"];
      const fresh = trialIds.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean) as Question[];
      setQuestions(fresh);
      setIndex(0);
      setSelected(null);
      setAnswers([]);
      setShowResult(false);
      setResumed(false);
      setShowPicker(false);
      savePersisted({
        questions: fresh,
        index: 0,
        selected: null,
        answers: [],
        startedAt: Date.now(),
      });
    } else if (persisted && persisted.questions?.length) {
      setQuestions(persisted.questions);
      setIndex(persisted.index);
      setSelected(persisted.selected);
      setAnswers(persisted.answers);
      setResumed(true);
      if (persisted.index >= persisted.questions.length) {
        setShowResult(true);
      }
    } else {
      setShowPicker(true);
    }
    setHydrated(true);
  }, [isTrial]);

  // Persiste a cada mudança relevante
  useEffect(() => {
    if (!hydrated || !questions.length) return;
    savePersisted({
      questions,
      index,
      selected,
      answers,
      startedAt: Date.now(),
    });
  }, [hydrated, questions, index, selected, answers]);

  function startWithMode(mode: "completo" | Category) {
    clearPersisted();
    const count = isTrial ? 7 : TOTAL;
    let fresh: Question[];
    if (isTrial) {
      if (mode === "completo") {
        const trialIds = ["qe60", "qe04", "qe39", "qe11", "qe74", "qe75", "q6"];
        fresh = trialIds.map(id => dbQuestions.find(q => q.id === id)).filter(Boolean) as Question[];
        if (fresh.length < 7) {
          fresh = buildFresh(dbQuestions, undefined, 7);
        }
      } else {
        const categoryQuestions = dbQuestions.filter(q => q.category === mode);
        const trialIds = ["qe60", "qe04", "qe39", "qe11", "qe74", "qe75", "q6"];
        const specTrialQs = categoryQuestions.filter(q => trialIds.includes(q.id));
        const exclude = specTrialQs.map(q => q.id);
        const others = getRandomizedQuestions(Math.max(0, 7 - specTrialQs.length), { exclude, categories: [mode], questionsList: dbQuestions });
        fresh = [...specTrialQs, ...others].slice(0, 7);
      }
    } else {
      fresh = buildFresh(dbQuestions, mode === "completo" ? undefined : mode, count);
    }
    setQuestions(fresh);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setResumed(false);
    setShowPicker(false);
    savePersisted({
      questions: fresh,
      index: 0,
      selected: null,
      answers: [],
      startedAt: Date.now(),
      mode,
    });
  }

  function restart() {
    clearPersisted();
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setResumed(false);
    setShowPicker(true);
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">
        Carregando…
      </div>
    );
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="glass rounded-3xl p-8 shadow-card">
          <h1 className="text-2xl font-display font-bold mb-2">Cadastre-se para começar</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Para acessar o simulado, crie sua conta com nome, CPF, telefone e vínculo de trabalho.
          </p>
          <Link
            to="/auth"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow"
          >
            Entrar ou criar conta
          </Link>
          <Link
            to="/"
            className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">
        Carregando simulado…
      </div>
    );
  }
  if (!questions.length) {
    if (isTrial) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground font-semibold text-primary-glow animate-pulse">Preparando seu teste grátis...</p>
          </div>
        </div>
      );
    }
    if (showPicker) {
      return <ModePicker onPick={startWithMode} />;
    }
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando simulado...</p>
        </div>
      </div>
    );
  }

  const q = questions[Math.min(index, questions.length - 1)];

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
  }

  const handleCompleteTrial = () => {
    if (user) {
      localStorage.setItem(`nexia:trial_completed:${user.id}`, "true");
    }
    clearPersisted();
    navigate({ to: "/checkout", replace: true });
  };

  function next() {
    const newAnswers = [...answers];
    newAnswers[index] = selected;
    setAnswers(newAnswers);
    setSelected(null);
    if (index + 1 >= questions.length) {
      setIndex(questions.length); // marca como finalizado
      setShowResult(true);
      if (user) {
        localStorage.setItem(`nexia:trial_completed:${user.id}`, "true");
      }
    } else {
      setIndex(index + 1);
    }
  }

  const score = answers.reduce<number>(
    (acc, a, i) => acc + (a !== null && a !== undefined && a === questions[i]?.correctIndex ? 1 : 0),
    0,
  );
  const answered = answers.reduce<number>(
    (acc, a) => acc + (a !== null && a !== undefined ? 1 : 0),
    0,
  );
  const wrongCount = answered - score;
  const accPct = answered > 0 ? Math.round((score / answered) * 100) : 0;
  const errPct = answered > 0 ? 100 - accPct : 0;
  const incMeta = INCIDENCE_META[q.incidence];
  const progress =
    ((Math.min(index, questions.length) + (selected !== null ? 1 : 0)) /
      questions.length) *
    100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        {!isTrial && (
          <button
            onClick={restart}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        )}
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">
            {isTrial ? "Teste Grátis (7 Questões) 🚀" : "Simulado Inteligente"}
          </p>
          {!showResult && (
            <h1 className="text-xl md:text-2xl font-display font-bold">
              Questão {Math.min(index + 1, questions.length)}{" "}
              <span className="text-muted-foreground text-base font-normal">
                / {questions.length}
              </span>
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl border border-success/30 bg-success/10 text-center min-w-[78px]">
            <p className="text-[10px] uppercase tracking-wide text-success/80">Acertos</p>
            <p className="text-sm font-display font-bold text-success leading-tight">
              {score} <span className="text-[10px] opacity-80">({accPct}%)</span>
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-destructive/30 bg-destructive/10 text-center min-w-[78px]">
            <p className="text-[10px] uppercase tracking-wide text-destructive/80">Erros</p>
            <p className="text-sm font-display font-bold text-destructive leading-tight">
              {wrongCount} <span className="text-[10px] opacity-80">({errPct}%)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Banner de retomada */}
      <AnimatePresence>
        {resumed && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary-glow" />
              Você voltou de onde parou. Bora terminar! 🚦
            </span>
            <button
              onClick={() => setResumed(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ok
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-6">
        <motion.div
          className="h-full gradient-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {!showResult && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-3xl p-6 md:p-8 shadow-card"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${incMeta.className}`}>
                {incMeta.emoji} {incMeta.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary/50">
                {CATEGORY_LABELS[q.category]}
              </span>
              {q.trap && (
                <span className="text-xs px-2.5 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Pegadinha clássica
                </span>
              )}
            </div>

            {/* Statement */}
            <h2 className="text-lg md:text-xl font-medium leading-relaxed">
              {q.statement}
            </h2>

            {/* Placa visual oficial */}
            {q.placa && (
              <div className="mt-5 flex justify-center">
                <Placa id={q.placa} size={170} />
              </div>
            )}

            {/* Options */}
            <div className="mt-6 space-y-2.5">
              {q.options.map((opt, i) => {
                const isSel = selected === i;
                const isCorrect = i === q.correctIndex;
                const reveal = selected !== null;
                const state = !reveal
                  ? "idle"
                  : isCorrect
                    ? "correct"
                    : isSel
                      ? "wrong"
                      : "muted";

                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={selected !== null}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                      state === "correct"
                        ? "border-success/50 bg-success/10"
                        : state === "wrong"
                          ? "border-destructive/50 bg-destructive/10"
                          : state === "muted"
                            ? "border-border bg-secondary/30 opacity-60"
                            : "border-border bg-secondary/50 hover:border-primary/40 hover:bg-secondary"
                    } ${selected === null ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm border ${
                        state === "correct"
                          ? "bg-success text-success-foreground border-success"
                          : state === "wrong"
                            ? "bg-destructive text-destructive-foreground border-destructive"
                            : "bg-background/40 border-border"
                      }`}
                    >
                      {state === "correct" ? (
                        <Check className="h-4 w-4" />
                      ) : state === "wrong" ? (
                        <X className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </div>
                    <span className="text-sm md:text-base pt-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback detalhado */}
            <AnimatePresence>
              {selected !== null && <DetailedFeedback q={q} selected={selected} />}
            </AnimatePresence>

            {selected !== null && (
              <button
                onClick={next}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
              >
                {index + 1 >= questions.length ? "Ver resultado" : "Próxima"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Tela de Resultado + Revisão */}
      <AnimatePresence>
        {showResult && (
          <ResultScreen
            questions={questions}
            answers={answers}
            score={score}
            onRestart={restart}
            isTrial={isTrial}
            onCompleteTrial={handleCompleteTrial}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailedFeedback({
  q,
  selected,
}: {
  q: Question;
  selected: number;
}) {
  const correct = selected === q.correctIndex;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-5 p-5 rounded-2xl border ${
        correct
          ? "border-success/30 bg-success/5"
          : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-warning" />
        {correct ? "Mandou bem! Entenda o porquê:" : "Quase! Veja a explicação:"}
      </p>

      <p className="text-sm font-medium mb-2">
        ✅ Resposta correta:{" "}
        <span className="text-success">{q.options[q.correctIndex]}</span>
      </p>

      <p className="text-sm text-foreground/90 leading-relaxed">
        {q.detailedExplanation ?? q.explanation}
      </p>

      {q.legalBase && (
        <p className="text-xs mt-3 flex items-start gap-2 text-muted-foreground">
          <Scale className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold text-foreground/80">Base legal: </span>
            {q.legalBase}
          </span>
        </p>
      )}

      {q.commonMistake && (
        <p className="text-xs mt-2 flex items-start gap-2 text-destructive/90">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold">Pegadinha: </span>
            {q.commonMistake}
          </span>
        </p>
      )}

      <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3">
        <p className="text-[11px] uppercase tracking-widest text-primary-glow font-bold flex items-center gap-1.5 mb-1">
          <Brain className="h-3.5 w-3.5" /> Gancho de memória
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {getMemoryHook(q)}
        </p>
      </div>
    </motion.div>
  );
}

function ModePicker({ onPick }: { onPick: (m: "completo" | Category) => void }) {
  const cats: { id: Category; icon: string }[] = [
    { id: "legislacao", icon: "📘" },
    { id: "placas", icon: "🚸" },
    { id: "direcao-defensiva", icon: "🛡️" },
    { id: "primeiros-socorros", icon: "🚑" },
    { id: "infracoes", icon: "⚠️" },
    { id: "meio-ambiente", icon: "🌱" },
    { id: "mecanica", icon: "🔧" },
    { id: "prioridade", icon: "🔀" },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6 gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">
          Simulado Inteligente
        </p>
      </div>

      <h1 className="text-2xl md:text-3xl font-display font-bold text-center">
        Escolha o tipo de simulado
      </h1>
      <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
        Treine no formato oficial ou foque em uma matéria específica.
      </p>

      <button
        onClick={() => onPick("completo")}
        className="w-full text-left rounded-2xl border border-primary/40 bg-primary/10 p-5 shadow-glow hover:bg-primary/15 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-primary-glow font-bold">
              Recomendado
            </p>
            <p className="font-display font-bold text-lg">Simulado completo</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary-glow mt-2 shrink-0" />
        </div>
      </button>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
          <ListChecks className="h-3.5 w-3.5" /> Ou treine por categoria
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className="text-left rounded-2xl border border-border bg-background/40 p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <p className="text-sm font-semibold leading-tight">{CATEGORY_LABELS[c.id]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  questions,
  answers,
  score,
  onRestart,
  isTrial,
  onCompleteTrial,
}: {
  questions: Question[];
  answers: (number | null)[];
  score: number;
  onRestart: () => void;
  isTrial: boolean;
  onCompleteTrial: () => void;
}) {
  const [tab, setTab] = useState<"resumo" | "erradas" | "todas">("resumo");
  const total = questions.length;
  const errors = useMemo(
    () =>
      questions
        .map((q, i) => ({ q, i, picked: answers[i] }))
        .filter((x) => x.picked === null || x.picked !== x.q.correctIndex),
    [questions, answers],
  );
  const accuracy = Math.round((score / total) * 100);

  const errorPct = 100 - accuracy;
  const approved = accuracy >= 70;

  // Desempenho por categoria
  const byCategory = useMemo(() => {
    const map = new Map<Question["category"], { right: number; total: number }>();
    questions.forEach((q, i) => {
      const cur = map.get(q.category) ?? { right: 0, total: 0 };
      cur.total += 1;
      if (answers[i] !== null && answers[i] !== undefined && answers[i] === q.correctIndex) {
        cur.right += 1;
      }
      map.set(q.category, cur);
    });
    return Array.from(map.entries())
      .map(([cat, v]) => ({
        cat,
        label: CATEGORY_LABELS[cat],
        pct: Math.round((v.right / v.total) * 100),
        right: v.right,
        total: v.total,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [questions, answers]);

  const best = byCategory[0];
  const worst = byCategory[byCategory.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass rounded-3xl p-6 md:p-8 shadow-glow"
    >
      <div className="text-center">
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-glow ${
            approved ? "bg-success" : "bg-destructive"
          }`}
        >
          {approved ? (
            <Check className="h-10 w-10 text-success-foreground" />
          ) : (
            <X className="h-10 w-10 text-destructive-foreground" />
          )}
        </div>
        <span
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${
            approved
              ? "bg-success/15 text-success border border-success/40"
              : "bg-destructive/15 text-destructive border border-destructive/40"
          }`}
        >
          {approved ? "Aprovado" : "Não aprovado"} · Mínimo 70%
        </span>
        <h2 className="text-3xl font-display font-bold">
          {score}/{total}{" "}
          <span className="text-lg text-muted-foreground">({accuracy}%)</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          {approved
            ? "Você atingiu a nota mínima para a prova teórica. Siga praticando para garantir!"
            : "Você ficou abaixo dos 70% exigidos. Revise as erradas abaixo e tente de novo."}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <MetricCard label="Acertos" value={`${score} (${accuracy}%)`} accent="success" />
        <MetricCard label="Erros" value={`${errors.length} (${errorPct}%)`} accent="destructive" />
        <MetricCard label="Aproveitamento" value={`${accuracy}%`} accent="primary" />
        <MetricCard label="Status" value={approved ? "Aprovado" : "Reprovado"} accent={approved ? "success" : "destructive"} />
      </div>

      {/* Melhor / Pior desempenho */}
      {byCategory.length > 1 && (
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
            <p className="text-[10px] uppercase tracking-widest text-success/90 font-semibold">
              Melhor desempenho
            </p>
            <p className="text-lg font-display font-bold mt-1">{best.label}</p>
            <p className="text-xs text-muted-foreground">
              {best.right}/{best.total} acertos · {best.pct}%
            </p>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-[10px] uppercase tracking-widest text-destructive/90 font-semibold">
              Pior desempenho — foque aqui
            </p>
            <p className="text-lg font-display font-bold mt-1">{worst.label}</p>
            <p className="text-xs text-muted-foreground">
              {worst.right}/{worst.total} acertos · {worst.pct}%
            </p>
          </div>
        </div>
      )}

      {/* Breakdown completo por categoria */}
      {byCategory.length > 0 && (
        <div className="mt-3 rounded-2xl border border-border bg-background/30 p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            Desempenho por categoria
          </p>
          {byCategory.map((c) => (
            <div key={c.cat} className="flex items-center gap-3">
              <span className="text-xs w-40 shrink-0 truncate">{c.label}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full ${
                    c.pct >= 70 ? "bg-success" : c.pct >= 50 ? "bg-warning" : "bg-destructive"
                  }`}
                  style={{ width: `${c.pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold w-20 text-right">
                {c.right}/{c.total} ({c.pct}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-border">
        {[
          { id: "resumo", label: "Resumo" },
          { id: "erradas", label: `Erradas (${errors.length})` },
          { id: "todas", label: "Todas" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das tabs */}
      <div className="mt-4">
        {tab === "resumo" && (
          <p className="text-sm text-muted-foreground">
            {errors.length === 0 ? (
              <>🎉 Gabaritou! Não há questões para revisar nesta rodada.</>
            ) : (
              <>
                Você errou {errors.length} questão{errors.length > 1 ? "ões" : ""}.
                Clique em <span className="font-semibold text-foreground">Erradas</span>{" "}
                para revisar cada uma com explicação detalhada, base legal e a
                pegadinha que costuma derrubar candidatos.
              </>
            )}
          </p>
        )}

        {tab === "erradas" && (
          <div className="space-y-3">
            {errors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma errada — parabéns! 🏆
              </p>
            ) : (
              errors.map(({ q, i, picked }) => (
                <ReviewCard
                  key={q.id}
                  index={i}
                  q={q}
                  picked={picked ?? null}
                  defaultOpen={errors.length <= 3}
                />
              ))
            )}
          </div>
        )}

        {tab === "todas" && (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <ReviewCard
                key={q.id}
                index={i}
                q={q}
                picked={answers[i] ?? null}
                defaultOpen={false}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-2">
        {isTrial ? (
          <button
            onClick={onCompleteTrial}
            className="w-full px-5 py-4 rounded-xl gradient-primary text-primary-foreground font-bold shadow-glow text-lg animate-pulse"
          >
            Adquirir o Simulado Completo 🚀
          </button>
        ) : (
          <button
            onClick={onRestart}
            className="w-full px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
          >
            Treinar mais um simulado
          </button>
        )}
        {!isTrial && (
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold hover:bg-accent/30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "success" | "destructive" | "primary";
}) {
  const cls =
    accent === "success"
      ? "border-success/30 bg-success/10 text-success"
      : accent === "destructive"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : "border-primary/30 bg-primary/10 text-primary-glow";
  return (
    <div className={`rounded-2xl border p-4 text-center ${cls}`}>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wide opacity-80 mt-0.5">{label}</p>
    </div>
  );
}

function ReviewCard({
  q,
  index,
  picked,
  defaultOpen,
}: {
  q: Question;
  index: number;
  picked: number | null;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const correct = picked !== null && picked === q.correctIndex;
  const skipped = picked === null;

  return (
    <div
      className={`rounded-2xl border ${
        correct
          ? "border-success/30 bg-success/5"
          : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
            correct
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">
            Questão {index + 1} · {CATEGORY_LABELS[q.category]}
          </p>
          <p className="text-sm font-medium line-clamp-2">{q.statement}</p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 mt-2 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 mt-2 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
              {q.placa && (
                <div className="flex justify-center pt-2">
                  <Placa id={q.placa} size={120} />
                </div>
              )}
              {!skipped && !correct && (
                <p className="text-sm">
                  <span className="text-destructive font-semibold">Sua resposta: </span>
                  <span className="text-foreground/80">{q.options[picked!]}</span>
                </p>
              )}
              {skipped && (
                <p className="text-sm text-muted-foreground italic">
                  Você não respondeu esta questão.
                </p>
              )}
              <p className="text-sm">
                <span className="text-success font-semibold">Correta: </span>
                <span className="text-foreground/90">{q.options[q.correctIndex]}</span>
              </p>

              <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                <p className="text-xs uppercase tracking-wide text-primary-glow font-semibold mb-1 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Explicação detalhada
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {q.detailedExplanation ?? q.explanation}
                </p>
              </div>

              {q.legalBase && (
                <p className="text-xs flex items-start gap-2 text-muted-foreground">
                  <Scale className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold text-foreground/80">Base legal: </span>
                    {q.legalBase}
                  </span>
                </p>
              )}

              {q.commonMistake && (
                <p className="text-xs flex items-start gap-2 text-destructive/90">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold">Pegadinha: </span>
                    {q.commonMistake}
                  </span>
                </p>
              )}

              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                <p className="text-[11px] uppercase tracking-widest text-primary-glow font-bold flex items-center gap-1.5 mb-1">
                  <Brain className="h-3.5 w-3.5" /> Gancho de memória
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {getMemoryHook(q)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
