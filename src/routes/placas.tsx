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
import {
  CATALOGO,
  CATEGORIA_META,
  ChipCategoria,
  PlacasCatalogo,
  categoriaDe,
  estudoDaPlaca,
  type CategoriaPlaca,
  type FiltroCategoria,
  type PlacaCatalogo,
} from "@/components/PlacasCatalogo";
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
  AlertTriangle,
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

/** Escolha do aluno dentro do Treino de Placas. */
const OPCOES_PLACAS: {
  modo: "catalog" | "jogo" | "adaptativo";
  emoji: string;
  titulo: string;
  desc: string;
}[] = [
  {
    modo: "catalog",
    emoji: "📖",
    titulo: "Ver todas as placas",
    desc: `${CATALOGO.length} placas oficiais com imagem, código e significado — filtre por categoria.`,
  },
  {
    modo: "jogo",
    emoji: "🧠",
    titulo: "Fazer o simulado",
    desc: "15 placas por rodada: veja o sinal e escolha o significado certo.",
  },
  {
    modo: "adaptativo",
    emoji: "🎯",
    titulo: "Treino adaptativo",
    desc: "Prioriza as placas que você erra e as que mais caem na prova.",
  },
];

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

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Significado/dica escritos à mão para as placas-chave (estudo aprofundado). */
// (helper compartilhado em @/components/PlacasCatalogo)

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

      {/* Escolha o que fazer: ver as placas ou fazer o simulado */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {OPCOES_PLACAS.map((o) => {
          const ativo = viewMode === o.modo;
          return (
            <button
              key={o.modo}
              type="button"
              onClick={() => setViewMode(o.modo)}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                ativo
                  ? "border-primary/60 bg-primary/10 shadow-glow"
                  : "border-border/40 bg-background/40 hover:border-primary/40 hover:bg-background/70"
              }`}
            >
              <div className="text-2xl mb-1">{o.emoji}</div>
              <p className="text-sm font-semibold leading-tight">{o.titulo}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{o.desc}</p>
            </button>
          );
        })}
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
            valor="identificacao"
            ativo={categoria === "identificacao"}
            onClick={() => setCategoria("identificacao")}
          />
          <ChipCategoria
            valor="servicos"
            ativo={categoria === "servicos"}
            onClick={() => setCategoria("servicos")}
          />
          <ChipCategoria
            valor="turisticas"
            ativo={categoria === "turisticas"}
            onClick={() => setCategoria("turisticas")}
          />
          <ChipCategoria
            valor="obras"
            ativo={categoria === "obras"}
            onClick={() => setCategoria("obras")}
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

