import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getQuestionBank,
  loadQuestionOverrides,
  INCIDENCE_META,
  type Question,
} from "@/data/questions";
import { Placa, type PlacaId } from "@/components/Placa";
import { Input } from "@/components/ui/input";
import catalogoJson from "@/data/placas-catalog-named.json";
import {
  Check,
  X,
  ArrowRight,
  Sparkles,
  TrafficCone,
  Lightbulb,
  Target,
  RotateCcw,
  Trophy,
  Info,
  AlertTriangle,
  Search,
  Gamepad2,
} from "lucide-react";

export const Route = createFileRoute("/placas")({
  component: PlacasTrainerPage,
  head: () => ({
    meta: [
      { title: "Placas de Trânsito — Catálogo + Quiz das Placas · Nexia DETRAN" },
      {
        name: "description",
        content:
          "Consulte as placas oficiais de trânsito com imagem, código e significado — filtre por advertência, regulamentação e indicação, jogue o quiz das placas e treine as que mais caem na prova.",
      },
    ],
  }),
});

const SESSION_SIZE = 10;
const STORAGE_KEY = "nexia:placas:weakness:v1";

interface WeaknessEntry {
  seen: number;
  wrong: number;
  lastWrongAt?: number;
}
type WeaknessMap = Record<string, WeaknessEntry>;

function loadWeakness(): WeaknessMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WeaknessMap) : {};
  } catch {
    return {};
  }
}
function saveWeakness(map: WeaknessMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

// Pool de placas vem do banco efetivo (estático + overrides do admin):
// questões desabilitadas ficam de fora das sessões de treino.
function buildSession(weakness: WeaknessMap, pool: Question[]): Question[] {
  const placaPool = pool.filter((q) => !!q.placa);
  const now = Date.now();
  const scored = placaPool.map((q) => {
    const w = weakness[q.placa as PlacaId] ?? { seen: 0, wrong: 0 };
    const wrongRate = w.seen > 0 ? w.wrong / w.seen : 0;
    const incidenceWeight = INCIDENCE_META[q.incidence].weight;
    // Fraqueza pesa MUITO: erros recentes sobem priorização.
    const recency =
      w.lastWrongAt && now - w.lastWrongAt < 1000 * 60 * 60 * 24 * 3 ? 1.5 : 1;
    // Boost grande para placas nunca vistas, garantindo cobertura.
    const novelty = w.seen === 0 ? 1.8 : 1;
    const base = incidenceWeight * (1 + 3 * wrongRate) * recency * novelty;
    return { q, score: base * (0.6 + Math.random() * 0.8) };
  })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.q);

  // Deduplica por placa (uma questão por placa por sessão), depois corta.
  const seenPlacas = new Set<string>();
  const unique: Question[] = [];
  for (const q of scored) {
    const id = q.placa as string;
    if (seenPlacas.has(id)) continue;
    seenPlacas.add(id);
    unique.push(q);
    if (unique.length >= SESSION_SIZE) break;
  }
  // Embaralha alternativas
  return unique.map((q) => {
    const indices = q.options.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return {
      ...q,
      options: indices.map((i) => q.options[i]),
      correctIndex: indices.indexOf(q.correctIndex),
    };
  });
}

// ==========================================
// CATÁLOGO DAS PLACAS OFICIAIS (Supabase Storage)
// Fonte: src/data/placas-catalog-named.json — sincronizado a cada upload
// do painel admin. 146 placas oficiais do CONTRAN com imagem real.
// ==========================================

type CategoriaPlaca = "advertencia" | "regulamentacao" | "indicacao";
type FiltroCategoria = "todas" | CategoriaPlaca;

interface PlacaCatalogo {
  code?: string | null;
  category?: string | null;
  name?: string | null;
  file?: string;
  public_url?: string | null;
}

const CATALOGO: PlacaCatalogo[] = (
  catalogoJson as unknown as PlacaCatalogo[]
).filter((p) => !!p.public_url && !!p.name);

const CATEGORIA_META: Record<
  CategoriaPlaca,
  {
    label: string;
    upper: string;
    dot: string;
    chipAtivo: string;
    chipHover: string;
    badge: string;
    glow: string;
  }
> = {
  advertencia: {
    label: "Advertência",
    upper: "ADVERTÊNCIA",
    dot: "bg-amber-500",
    chipAtivo: "bg-amber-500/20 border-amber-500/40 text-amber-400",
    chipHover: "hover:text-amber-400",
    badge: "bg-amber-500/15 border-amber-500/35 text-amber-400",
    glow: "hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]",
  },
  regulamentacao: {
    label: "Regulamentação",
    upper: "REGULAMENTAÇÃO",
    dot: "bg-red-500",
    chipAtivo: "bg-destructive/20 border-destructive/40 text-destructive-glow",
    chipHover: "hover:text-destructive-glow",
    badge: "bg-destructive/15 border-destructive/35 text-destructive-glow",
    glow: "hover:border-destructive/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]",
  },
  indicacao: {
    label: "Indicação",
    upper: "INDICAÇÃO",
    dot: "bg-blue-500",
    chipAtivo: "bg-blue-500/20 border-blue-500/40 text-blue-400",
    chipHover: "hover:text-blue-400",
    badge: "bg-blue-500/15 border-blue-500/35 text-blue-400",
    glow: "hover:border-blue-500/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]",
  },
};

const CONTAGENS: Record<FiltroCategoria, number> = {
  todas: CATALOGO.length,
  advertencia: CATALOGO.filter((p) => categoriaDe(p) === "advertencia").length,
  regulamentacao: CATALOGO.filter((p) => categoriaDe(p) === "regulamentacao")
    .length,
  indicacao: CATALOGO.filter((p) => categoriaDe(p) === "indicacao").length,
};

function categoriaDe(p: PlacaCatalogo): CategoriaPlaca | null {
  return p.category === "advertencia" ||
    p.category === "regulamentacao" ||
    p.category === "indicacao"
    ? p.category
    : null;
}

/** Busca por nome/código ignora acento e caixa ("curva a" acha "Curva à"). */
function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Significado/dica escritos à mão para as placas-chave (estudo aprofundado). */
function estudoDaPlaca(code?: string | null) {
  if (!code) return undefined;
  return PLACA_STUDY_DATA.find((s) => s.id === code);
}

// ==========================================
// PÁGINA
// ==========================================

function PlacasTrainerPage() {
  const [hydrated, setHydrated] = useState(false);
  const [weakness, setWeakness] = useState<WeaknessMap>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [viewMode, setViewMode] = useState<"catalog" | "jogo" | "adaptativo">(
    "catalog",
  );
  // Filtro de categoria compartilhado entre catálogo e quiz (como no
  // souhabilitado: "Todas / Advertência / Regulamentação / Indicação").
  const [categoria, setCategoria] = useState<FiltroCategoria>("todas");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Espera os overrides do admin chegar (questões desabilitadas) antes
      // de montar a sessão — senão uma desabilitada poderia aparecer aqui.
      await loadQuestionOverrides().catch(() => {});
      if (cancelled) return;
      const w = loadWeakness();
      setWeakness(w);
      setQuestions(buildSession(w, getQuestionBank()));
      setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, []);

  function restart() {
    const w = loadWeakness();
    setWeakness(w);
    setQuestions(buildSession(w, getQuestionBank()));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  }

  // Top fraquezas (computado antes de qualquer retorno para respeitar a regra dos hooks)
  const topWeakness = useMemo(() => {
    // Imagem oficial por código (evita cartão branco p/ códigos fora do SVG).
    const imgByPlaca = new Map<string, string>();
    for (const wq of getQuestionBank()) {
      if (wq.placa && wq.image_url && !imgByPlaca.has(wq.placa)) imgByPlaca.set(wq.placa, wq.image_url);
    }
    return Object.entries(weakness)
      .map(([placa, w]) => ({
        placa: placa as PlacaId,
        image: imgByPlaca.get(placa),
        rate: w.seen > 0 ? w.wrong / w.seen : 0,
        wrong: w.wrong,
        seen: w.seen,
      }))
      .filter((x) => x.wrong > 0)
      .sort((a, b) => b.rate - a.rate || b.wrong - a.wrong)
      .slice(0, 3);
  }, [weakness]);

  const q = questions.length
    ? questions[Math.min(index, questions.length - 1)]
    : undefined;

  function pick(i: number) {
    if (!q || selected !== null) return;
    setSelected(i);
    // Atualiza fraquezas
    const placaId = q.placa as PlacaId;
    const prev = weakness[placaId] ?? { seen: 0, wrong: 0 };
    const isWrong = i !== q.correctIndex;
    const updated: WeaknessMap = {
      ...weakness,
      [placaId]: {
        seen: prev.seen + 1,
        wrong: prev.wrong + (isWrong ? 1 : 0),
        lastWrongAt: isWrong ? Date.now() : prev.lastWrongAt,
      },
    };
    setWeakness(updated);
    saveWeakness(updated);
  }

  function next() {
    if (!q) return;
    const newAnswers = [...answers];
    newAnswers[index] = selected;
    setAnswers(newAnswers);
    setSelected(null);
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  const score = answers.reduce<number>(
    (acc, a, i) => acc + (a !== null && a === questions[i]?.correctIndex ? 1 : 0),
    0,
  );
  const progress = questions.length
    ? ((Math.min(index, questions.length) + (selected !== null ? 1 : 0)) /
        questions.length) *
      100
    : 0;

  const rotuloModo =
    viewMode === "catalog"
      ? "Catálogo oficial"
      : viewMode === "jogo"
        ? "Quiz das Placas"
        : "Treino adaptativo";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-2">
            <TrafficCone className="h-4 w-4" /> Placas · {rotuloModo}
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">
            Placas de <span className="gradient-text">trânsito</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {viewMode === "catalog" &&
              `${CATALOGO.length} placas oficiais com imagem, código e significado — filtre por categoria.`}
            {viewMode === "jogo" &&
              "Veja a placa e escolha o significado certo — 15 por rodada."}
            {viewMode === "adaptativo" &&
              "Prioriza automaticamente suas fraquezas + maior incidência."}
          </p>
        </div>
        {viewMode === "adaptativo" && !done && hydrated && q && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Questão</p>
            <p className="text-xl font-display font-bold">
              {Math.min(index + 1, questions.length)}
              <span className="text-muted-foreground text-sm font-normal">
                {" "}
                / {questions.length}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Modo Selector tabs */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex p-1 rounded-2xl bg-black/40 border border-border/30 shadow-inner flex-wrap">
          <button
            onClick={() => setViewMode("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "catalog"
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📖 Catálogo
          </button>
          <button
            onClick={() => setViewMode("jogo")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "jogo"
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🧠 Quiz das Placas
          </button>
          <button
            onClick={() => setViewMode("adaptativo")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "adaptativo"
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎯 Treino Adaptativo
          </button>
        </div>
      </div>

      {/* Filtros de categoria (catálogo + quiz) */}
      {(viewMode === "catalog" || viewMode === "jogo") && (
        <div className="flex gap-2 flex-wrap items-center mb-5">
          <ChipCategoria
            valor="todas"
            ativo={categoria === "todas"}
            onClick={() => setCategoria("todas")}
          />
          <ChipCategoria
            valor="advertencia"
            ativo={categoria === "advertencia"}
            onClick={() => setCategoria("advertencia")}
          />
          <ChipCategoria
            valor="regulamentacao"
            ativo={categoria === "regulamentacao"}
            onClick={() => setCategoria("regulamentacao")}
          />
          <ChipCategoria
            valor="indicacao"
            ativo={categoria === "indicacao"}
            onClick={() => setCategoria("indicacao")}
          />
        </div>
      )}

      {/* ===== CATÁLOGO ===== */}
      {viewMode === "catalog" && <PlacasCatalogo categoria={categoria} />}

      {/* ===== QUIZ DAS PLACAS ===== */}
      {viewMode === "jogo" && (
        <QuizDasPlacas
          categoria={categoria}
          onSair={() => setViewMode("catalog")}
        />
      )}

      {/* ===== TREINO ADAPTATIVO ===== */}
      {viewMode === "adaptativo" && (!hydrated || !q) && (
        <div className="mx-auto max-w-3xl py-10 text-center text-muted-foreground">
          Preparando treino de placas…
        </div>
      )}

      {viewMode === "adaptativo" && hydrated && q && (
        <>
          {/* Painel de fraquezas */}
          {topWeakness.length > 0 && !done && (
            <div className="mb-4 rounded-2xl border border-destructive/25 bg-destructive/5 p-3 flex items-center gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 text-xs text-destructive shrink-0">
                <Target className="h-4 w-4" />
                <span className="font-semibold uppercase tracking-wider">
                  Suas fraquezas
                </span>
              </div>
              <div className="flex items-center gap-2">
                {topWeakness.map((w) => (
                  <div
                    key={w.placa}
                    className="flex items-center gap-2 rounded-xl bg-background/50 border border-border/40 pl-2 pr-3 py-1.5"
                    title={`${w.wrong}/${w.seen} erros`}
                  >
                    {w.image ? (
                      <img src={w.image} alt={w.placa} className="h-8 w-8 rounded-md bg-white p-0.5 object-contain" />
                    ) : (
                      <Placa id={w.placa} size={32} className="!p-1 !rounded-md" />
                    )}
                    <span className="text-xs font-semibold">
                      {Math.round(w.rate * 100)}%
                      <span className="text-[10px] text-muted-foreground ml-1">
                        erro
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="h-2 rounded-full bg-secondary overflow-hidden mb-6">
            <motion.div
              className="h-full gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {!done && (
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="glass rounded-3xl p-6 md:p-8 shadow-card"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${INCIDENCE_META[q.incidence].className}`}
                  >
                    {INCIDENCE_META[q.incidence].emoji}{" "}
                    {INCIDENCE_META[q.incidence].label}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary/50">
                    Código oficial: {q.placa}
                  </span>
                </div>

                {/* Placa centralizada e grande */}
                <div className="flex justify-center my-4">
                  {q.image_url ? (
                    <img src={q.image_url} alt="placa de trânsito" className="max-h-[200px] max-w-[200px] object-contain" />
                  ) : q.placa ? (
                    <Placa id={q.placa} size={200} />
                  ) : null}
                </div>

                <h2 className="text-lg md:text-xl font-medium leading-relaxed text-center">
                  {q.statement}
                </h2>

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

                <AnimatePresence>
                  {selected !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-5 p-5 rounded-2xl border ${
                        selected === q.correctIndex
                          ? "border-success/30 bg-success/5"
                          : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-warning" />
                        {selected === q.correctIndex
                          ? "Mandou bem! Fixa essa:"
                          : "Quase! Memorize agora:"}
                      </p>
                      <p className="text-sm font-medium mb-2">
                        ✅{" "}
                        <span className="text-success">
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {q.detailedExplanation ?? q.explanation}
                      </p>
                      {q.tip && (
                        <p className="text-sm mt-3 p-2 rounded-lg bg-primary/10 text-primary-glow">
                          💡 <span className="font-semibold">Macete:</span>{" "}
                          {q.tip}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selected !== null && (
                  <button
                    onClick={next}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
                  >
                    {index + 1 >= questions.length
                      ? "Ver resultado"
                      : "Próxima placa"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 md:p-8 shadow-glow"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <Trophy className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-display font-bold">
                  {score}/{questions.length}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {score === questions.length
                    ? "Perfeito! Você dominou esta rodada de placas."
                    : "Boa! Suas fraquezas foram registradas — a próxima rodada vai focar nelas."}
                </p>
              </div>

              {/* Resumo placa a placa */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {questions.map((qq, i) => {
                  const correct = answers[i] === qq.correctIndex;
                  return (
                    <div
                      key={qq.id}
                      className={`rounded-2xl p-3 border flex items-center gap-3 ${
                        correct
                          ? "border-success/30 bg-success/5"
                          : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      {qq.image_url ? (
                        <img
                          src={qq.image_url}
                          alt={qq.placa ?? "placa"}
                          className="h-[76px] w-[76px] shrink-0 rounded-xl bg-white p-2 object-contain"
                        />
                      ) : qq.placa ? (
                        <Placa
                          id={qq.placa}
                          size={44}
                          className="!p-1.5 !rounded-lg"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {qq.placa}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            correct ? "text-success" : "text-destructive"
                          }`}
                        >
                          {correct ? "Acertou" : "Revisar"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={restart}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
                >
                  <RotateCcw className="h-4 w-4" /> Nova rodada adaptativa
                </button>
              </div>
              <p className="text-[11px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> A próxima rodada prioriza as
                placas que você mais errou.
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

// ==========================================
// CHIP DE CATEGORIA (compartilhado catálogo/quiz)
// ==========================================

function ChipCategoria({
  valor,
  ativo,
  onClick,
}: {
  valor: FiltroCategoria;
  ativo: boolean;
  onClick: () => void;
}) {
  const meta = valor === "todas" ? null : CATEGORIA_META[valor];
  const label = valor === "todas" ? "Todas as Placas" : meta!.label;
  const ativoClasses =
    valor === "todas"
      ? "bg-zinc-800 border-zinc-700 text-foreground"
      : meta!.chipAtivo;
  const hoverClasses = valor === "todas" ? "" : meta!.chipHover;

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
        ativo
          ? ativoClasses
          : `bg-secondary/20 border-border/20 text-muted-foreground ${hoverClasses}`
      }`}
    >
      {meta && <span className={`w-2 h-2 rounded-full ${meta.dot}`} />}
      {label} ({CONTAGENS[valor]})
    </button>
  );
}

// ==========================================
// QUIZ DAS PLACAS (modelo souhabilitado /placas/jogar)
// Mostra a IMAGEM da placa e pergunta o significado — 4 alternativas
// (nome correto + 3 nomes de outras placas da mesma categoria).
// ==========================================

const QUIZ_SIZE = 15;

interface QuizPlaca {
  placa: PlacaCatalogo;
  correta: string;
  alternativas: string[];
}

function montarRodada(categoria: FiltroCategoria): QuizPlaca[] {
  const pool = CATALOGO.filter(
    (p) => categoria === "todas" || categoriaDe(p) === categoria,
  );
  const sorteadas = embaralhar(pool).slice(0, QUIZ_SIZE);

  return sorteadas.map((p) => {
    const nome = p.name as string;
    // Distratores preferem a MESMA categoria da placa exibida (mais difícil,
    // como a prova — "Curva à esquerda" x "Curva acentuada à esquerda");
    // se faltar, completa com o resto do catálogo. Sempre nomes diferentes.
    const mesmaCat = embaralhar(
      CATALOGO.filter(
        (o) => o !== p && !!o.name && o.name !== nome && categoriaDe(o) === categoriaDe(p),
      ),
    );
    const resto = embaralhar(
      CATALOGO.filter(
        (o) => o !== p && !!o.name && o.name !== nome && !mesmaCat.includes(o),
      ),
    );
    const distratores = [...mesmaCat, ...resto].slice(0, 3);
    const alternativas = embaralhar([
      nome,
      ...distratores.map((d) => d.name as string),
    ]);
    return { placa: p, correta: nome, alternativas };
  });
}

function QuizDasPlacas({
  categoria,
  onSair,
}: {
  categoria: FiltroCategoria;
  onSair: () => void;
}) {
  const [rodada, setRodada] = useState<QuizPlaca[]>(() =>
    montarRodada(categoria),
  );
  const [idx, setIdx] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [erradas, setErradas] = useState<QuizPlaca[]>([]);
  const [fim, setFim] = useState(false);

  // Trocou a categoria no filtro? Começa uma rodada nova.
  useEffect(() => {
    setRodada(montarRodada(categoria));
    setIdx(0);
    setEscolha(null);
    setAcertos(0);
    setErradas([]);
    setFim(false);
  }, [categoria]);

  if (!rodada.length) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-muted-foreground">
        Nenhuma placa encontrada nesta categoria.
      </div>
    );
  }

  const q = rodada[Math.min(idx, rodada.length - 1)];
  const catPlaca = categoriaDe(q.placa);
  const estudo = estudoDaPlaca(q.placa.code);
  const revelado = escolha !== null;
  const acertou = escolha !== null && q.alternativas[escolha] === q.correta;

  function responder(i: number) {
    if (escolha !== null) return;
    setEscolha(i);
    if (rodada[idx].alternativas[i] === rodada[idx].correta) {
      setAcertos((a) => a + 1);
    } else {
      setErradas((e) => [...e, rodada[idx]]);
    }
  }

  function proxima() {
    if (idx + 1 >= rodada.length) {
      setFim(true);
      return;
    }
    setIdx(idx + 1);
    setEscolha(null);
  }

  function novaRodada() {
    setRodada(montarRodada(categoria));
    setIdx(0);
    setEscolha(null);
    setAcertos(0);
    setErradas([]);
    setFim(false);
  }

  // ---- Resultado ----
  if (fim) {
    const total = rodada.length;
    const pct = Math.round((acertos / total) * 100);
    const msg =
      acertos === total
        ? "Perfeito! Você dominou as placas desta categoria."
        : acertos >= Math.ceil(total * 0.8)
          ? "Muito bom! Só escaparam algumas — revise os erros abaixo."
          : acertos >= Math.ceil(total * 0.6)
            ? "Boa tentativa! Estude os erros e jogue de novo."
            : "Continue estudando no catálogo — a próxima rodada sortea outras placas.";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 md:p-8 shadow-glow"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 shadow-glow">
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold">
            {acertos}/{total}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{pct}% de acertos</p>
          <p className="text-sm text-muted-foreground mt-2">{msg}</p>
        </div>

        {erradas.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-destructive mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Revise estas placas
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {erradas.map((e, i) => (
                <div
                  key={`${e.placa.file ?? e.placa.public_url}-${i}`}
                  className="rounded-2xl p-3 border border-destructive/30 bg-destructive/5 flex items-center gap-3"
                >
                  <div className="w-11 h-11 shrink-0 rounded-lg bg-white p-1 flex items-center justify-center">
                    <img
                      src={e.placa.public_url ?? ""}
                      alt={e.placa.name ?? ""}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground">
                      {e.placa.code ?? ""}
                    </p>
                    <p className="text-[11px] font-semibold leading-snug">
                      {e.correta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={novaRodada}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
          >
            <Gamepad2 className="h-4 w-4" /> Jogar de novo
          </button>
          <button
            onClick={onSair}
            className="px-5 py-3 rounded-xl border border-border bg-secondary/40 text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer"
          >
            Ver catálogo
          </button>
        </div>
      </motion.div>
    );
  }

  // ---- Pergunta ----
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
        className="glass rounded-3xl p-6 md:p-8 shadow-card"
      >
        {/* Topo: progresso + placar + sair */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-glow">
              Placa {Math.min(idx + 1, rodada.length)} / {rodada.length}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <Check className="h-3.5 w-3.5" /> {acertos}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
              <X className="h-3.5 w-3.5" /> {erradas.length}
            </span>
          </div>
          <button
            onClick={onSair}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Sair do quiz
          </button>
        </div>

        <p className="text-center text-sm md:text-base font-medium">
          Qual é o significado desta placa?
        </p>
        <div className="flex justify-center mt-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              catPlaca ? CATEGORIA_META[catPlaca].badge : "border-border bg-secondary/50"
            }`}
          >
            {catPlaca ? CATEGORIA_META[catPlaca].upper : "Placa"}
          </span>
        </div>

        {/* Imagem da placa (fundo branco, como no manual) */}
        <div className="flex justify-center my-5">
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-white p-4 shadow-card flex items-center justify-center">
            <img
              src={q.placa.public_url ?? ""}
              alt="Placa de trânsito — qual o significado?"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Alternativas */}
        <div className="space-y-2.5">
          {q.alternativas.map((opt, i) => {
            const isSel = escolha === i;
            const isCorrect = opt === q.correta;
            const state = !revelado
              ? "idle"
              : isCorrect
                ? "correct"
                : isSel
                  ? "wrong"
                  : "muted";

            return (
              <button
                key={`${opt}-${i}`}
                onClick={() => responder(i)}
                disabled={revelado}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  state === "correct"
                    ? "border-success/50 bg-success/10"
                    : state === "wrong"
                      ? "border-destructive/50 bg-destructive/10"
                      : state === "muted"
                        ? "border-border bg-secondary/30 opacity-60"
                        : "border-border bg-secondary/50 hover:border-primary/40 hover:bg-secondary"
                } ${!revelado ? "cursor-pointer" : "cursor-default"}`}
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

        {/* Feedback */}
        <AnimatePresence>
          {revelado && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 p-5 rounded-2xl border ${
                acertou
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {acertou ? "✅ Isso mesmo!" : "❌ A resposta certa era:"}
              </p>
              <p className="text-sm font-medium">
                <span className={acertou ? "text-success" : "text-destructive"}>
                  {q.correta}
                </span>
                {q.placa.code && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · {q.placa.code}
                  </span>
                )}
              </p>
              {estudo?.tip && (
                <p className="text-sm mt-3 p-2 rounded-lg bg-primary/10 text-primary-glow">
                  💡 <span className="font-semibold">Macete:</span>{" "}
                  {estudo.tip}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {revelado && (
          <button
            onClick={proxima}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
          >
            {idx + 1 >= rodada.length ? "Ver resultado" : "Próxima placa"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ==========================================
// ESTUDO (significados escritos para placas-chave)
// ==========================================
interface PlacaStudyItem {
  id: PlacaId;
  title: string;
  type: "regulamentacao" | "advertencia" | "indicacao";
  meaning: string;
  tip: string;
  legalBase?: string;
}

const PLACA_STUDY_DATA: PlacaStudyItem[] = [
  {
    id: "R-1",
    title: "R-1 — Parada Obrigatória",
    type: "regulamentacao",
    meaning: "Informa ao condutor que a parada do veículo é obrigatória antes de entrar ou cruzar a via transversal.",
    tip: "A parada deve ser COMPLETA (rodas totalmente paradas), e não apenas uma redução lenta de velocidade. Desrespeitar é infração gravíssima.",
    legalBase: "Art. 208 do CTB",
  },
  {
    id: "R-2",
    title: "R-2 — Dê a Preferência",
    type: "regulamentacao",
    meaning: "Indica ao condutor a obrigatoriedade de dar preferência de passagem ao veículo que circula pela via transversal.",
    tip: "Não exige a parada obrigatória se a via estiver livre, mas exige que você reduza a velocidade e pare se houver tráfego vindo.",
    legalBase: "Anexo II do CTB",
  },
  {
    id: "R-6a",
    title: "R-6a — Proibido Estacionar",
    type: "regulamentacao",
    meaning: "Assinala ao condutor a proibição de estacionar o veículo no trecho abrangido pela sinalização.",
    tip: "Permite a PARADA rápida apenas pelo tempo estritamente necessário para embarque ou desembarque de passageiros, sem interromper o fluxo.",
    legalBase: "Art. 181 do CTB",
  },
  {
    id: "R-6b",
    title: "R-6b — Proibido Parar e Estacionar",
    type: "regulamentacao",
    meaning: "Informa ao condutor que é proibida tanto a parada rápida quanto o estacionamento de veículos no trecho.",
    tip: "Pegadinha comum: aqui você não pode parar nem para um desembarque de 3 segundos! A proibição é absoluta.",
    legalBase: "Art. 181, VIII do CTB",
  },
  {
    id: "R-19",
    title: "R-19 — Velocidade Máxima Regulamentada",
    type: "regulamentacao",
    meaning: "Estabelece o limite máximo de velocidade em km/h permitido para a via.",
    tip: "O limite é válido a partir do ponto onde a placa está instalada até que haja outra placa de limite ou fim da regulamentação.",
    legalBase: "Art. 218 do CTB",
  },
  {
    id: "R-25a",
    title: "R-25a — Vire à Esquerda",
    type: "regulamentacao",
    meaning: "Regulamenta a obrigatoriedade de o condutor realizar a conversão à esquerda na interseção.",
    tip: "Garante que o sentido de fluxo da via transversal requer obrigatoriamente a conversão à esquerda por motivos de segurança.",
    legalBase: "Anexo II do CTB",
  },
  {
    id: "R-25d",
    title: "R-25d — Siga em Frente",
    type: "regulamentacao",
    meaning: "Assinala ao condutor que o único sentido de direção permitido é seguir em linha reta na interseção.",
    tip: "Diferente de vias de mão única, esta placa obriga você a continuar em frente na próxima bifurcação ou cruzamento.",
    legalBase: "Anexo II do CTB",
  },
  {
    id: "A-1a",
    title: "A-1a — Curva Acentuada à Esquerda",
    type: "advertencia",
    meaning: "Adverte o condutor sobre a proximidade de uma curva acentuada e perigosa para a esquerda à frente.",
    tip: "Reduza a velocidade na aproximação, antes da curva, para manter o centro de gravidade estável e evitar derrapagens.",
    legalBase: "Manual de Sinalização do CONTRAN",
  },
  {
    id: "A-2b",
    title: "A-2b — Curva à Direita",
    type: "advertencia",
    meaning: "Alerta o condutor sobre a existência de uma curva para a direita à frente na via.",
    tip: "Possui raio de curvatura maior que o da curva acentuada, mas ainda requer atenção e adequação de velocidade segura.",
    legalBase: "Manual de Sinalização do CONTRAN",
  },
  {
    id: "A-13a",
    title: "A-13a — Confluência à Esquerda",
    type: "advertencia",
    meaning: "Adverte o condutor sobre a junção de outra via à esquerda, onde há entrada de novos fluxos de tráfego.",
    tip: "Atenção ao retrovisor esquerdo e reduza a velocidade para facilitar a integração segura de outros veículos à sua pista.",
    legalBase: "Manual de Sinalização do CONTRAN",
  },
  {
    id: "A-32b",
    title: "A-32b — Passagem Sinalizada de Pedestres",
    type: "advertencia",
    meaning: "Alerta sobre a existência de faixa de travessia sinalizada para pedestres logo à frente.",
    tip: "Reduza a velocidade. Lembre-se: o pedestre que iniciou a travessia na faixa tem prioridade absoluta de passagem sobre o veículo.",
    legalBase: "Art. 70 do CTB",
  },
  {
    id: "A-33a",
    title: "A-33a — Área Escolar",
    type: "advertencia",
    meaning: "Adverte o condutor sobre a proximidade de trecho com trânsito frequente de escolares e crianças.",
    tip: "Redobre o cuidado, reduza a velocidade significativamente e prepare o pé no freio para imobilização de emergência.",
    legalBase: "Art. 220, XIV do CTB",
  },
  {
    id: "I-Hospital",
    title: "S-1 — Serviço de Hospital",
    type: "indicacao",
    meaning: "Indica a localização ou direção para acesso a serviços hospitalares de saúde e pronto-socorro.",
    tip: "Ao passar próximo a hospitais, evite o uso de buzinas e mantenha o ruído do motor sob controle para o conforto dos pacientes.",
    legalBase: "Art. 227 do CTB",
  },
  {
    id: "I-Posto",
    title: "S-13 — Posto de Abastecimento",
    type: "indicacao",
    meaning: "Indica a proximidade ou acesso de postos de combustível para abastecimento do veículo.",
    tip: "Muito útil para planejar viagens longas e evitar a infração de pane seca por falta de combustível na estrada.",
    legalBase: "Manual de Sinalização de Indicação",
  },
];

// ==========================================
// CATÁLOGO COMPLETO (146 placas oficiais — imagem real do Supabase)
// ==========================================

function PlacasCatalogo({ categoria }: { categoria: FiltroCategoria }) {
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<PlacaCatalogo | null>(null);

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    return CATALOGO.filter((p) => {
      if (categoria !== "todas" && categoriaDe(p) !== categoria) return false;
      if (!termo) return true;
      return (
        normalizar(p.name ?? "").includes(termo) ||
        normalizar(p.code ?? "").includes(termo)
      );
    });
  }, [categoria, busca]);

  // Esc fecha o modal (como no site de referência)
  useEffect(() => {
    if (!sel) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [sel]);

  const selEstudo = sel ? estudoDaPlaca(sel.code) : undefined;
  const selCat = sel ? categoriaDe(sel) : null;

  return (
    <div>
      {/* Busca por nome ou código */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou código (ex: A-1a)"
          className="pl-10"
          aria-label="Buscar placa por nome ou código"
        />
      </div>

      <p className="text-[11px] text-muted-foreground mb-4">
        {filtradas.length} de {CATALOGO.length} placas
        {categoria !== "todas" &&
          ` · categoria ${CATEGORIA_META[categoria as CategoriaPlaca].label}`}
        {busca.trim() && ` · busca "${busca.trim()}"`}
      </p>

      {/* Grid */}
      {filtradas.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground text-sm">
          Nenhuma placa encontrada para “{busca.trim()}”.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {filtradas.map((p) => {
            const cat = categoriaDe(p);
            const glow = cat ? CATEGORIA_META[cat].glow : "";
            return (
              <button
                key={p.file ?? p.public_url ?? p.name}
                onClick={() => setSel(p)}
                className={`glass rounded-2xl p-3 flex flex-col gap-2 border border-border/30 bg-[#0E101B]/80 cursor-pointer transition-all ${glow}`}
              >
                {/* Imagem real da placa (Supabase Storage) */}
                <div className="aspect-square rounded-xl bg-white flex items-center justify-center p-2.5 shadow-inner">
                  <img
                    src={p.public_url ?? ""}
                    alt={p.name ?? "Placa de trânsito"}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-left">
                  {p.code && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/50 bg-secondary/60 text-muted-foreground mb-1">
                      {p.code}
                    </span>
                  )}
                  <p className="text-[11px] leading-snug font-medium text-foreground/90">
                    {p.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de detalhe */}
      {sel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSel(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 relative border border-zinc-800 bg-[#0C0F1A]"
          >
            <button
              onClick={() => setSel(null)}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-40 h-40 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl">
                <img
                  src={sel.public_url ?? ""}
                  alt={sel.name ?? "Placa de trânsito"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold font-display">
                  {sel.code ? `${sel.code} — ` : ""}
                  {sel.name}
                </h2>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${
                      selCat
                        ? CATEGORIA_META[selCat].badge
                        : "border-border bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    {selCat ? CATEGORIA_META[selCat].label : "Placa"}
                  </span>
                </div>
              </div>

              <div className="w-full text-left space-y-4 pt-2">
                <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Significado
                  </h4>
                  <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {selEstudo?.meaning ?? sel.name}
                  </p>
                </div>

                {selEstudo?.tip && (
                  <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning" />{" "}
                      Dica de Prova / Macete
                    </h4>
                    <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                      {selEstudo.tip}
                    </p>
                  </div>
                )}

                {selEstudo?.legalBase && (
                  <div className="text-[10px] text-muted-foreground text-right">
                    Base legal: {selEstudo.legalBase}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSel(null)}
                className="w-full py-3.5 rounded-xl font-bold gradient-primary text-primary-foreground text-xs shadow-glow transition-all cursor-pointer"
              >
                Voltar ao Catálogo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
