import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  QUESTIONS,
  INCIDENCE_META,
  type Question,
} from "@/data/questions";
import { Placa, type PlacaId } from "@/components/Placa";
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
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/placas")({
  component: PlacasTrainerPage,
  head: () => ({
    meta: [
      { title: "Placas que Mais Caem — Treino Adaptativo · Nexia DETRAN" },
      {
        name: "description",
        content:
          "Treine apenas placas de trânsito, com priorização automática nas suas fraquezas e nas placas que mais caem na prova.",
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

const PLACA_POOL: Question[] = QUESTIONS.filter((q) => !!q.placa);

function buildSession(weakness: WeaknessMap): Question[] {
  const now = Date.now();
  const scored = PLACA_POOL.map((q) => {
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

function PlacasTrainerPage() {
  const [hydrated, setHydrated] = useState(false);
  const [weakness, setWeakness] = useState<WeaknessMap>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [viewMode, setViewMode] = useState<"quiz" | "catalog">("quiz");

  useEffect(() => {
    const w = loadWeakness();
    setWeakness(w);
    setQuestions(buildSession(w));
    setHydrated(true);
  }, []);

  function restart() {
    const w = loadWeakness();
    setWeakness(w);
    setQuestions(buildSession(w));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  }

  // Top fraquezas (computado antes de early returns para respeitar regra dos hooks)
  const topWeakness = useMemo(() => {
    return Object.entries(weakness)
      .map(([placa, w]) => ({
        placa: placa as PlacaId,
        rate: w.seen > 0 ? w.wrong / w.seen : 0,
        wrong: w.wrong,
        seen: w.seen,
      }))
      .filter((x) => x.wrong > 0)
      .sort((a, b) => b.rate - a.rate || b.wrong - a.wrong)
      .slice(0, 3);
  }, [weakness]);

  if (!hydrated || !questions.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">
        Preparando treino de placas…
      </div>
    );
  }

  const q = questions[Math.min(index, questions.length - 1)];

  function pick(i: number) {
    if (selected !== null) return;
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
  const progress =
    ((Math.min(index, questions.length) + (selected !== null ? 1 : 0)) /
      questions.length) *
    100;




  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-2">
            <TrafficCone className="h-4 w-4" /> Placas · {viewMode === "quiz" ? "Treino adaptativo" : "Catálogo de Estudo"}
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">
            Placas que <span className="gradient-text">mais caem</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {viewMode === "quiz"
              ? "Prioriza automaticamente suas fraquezas + maior incidência."
              : "Consulte todas as placas regulamentadas, seus significados e macetes."}
          </p>
        </div>
        {viewMode === "quiz" && !done && (
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
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 rounded-2xl bg-black/40 border border-border/30 shadow-inner">
          <button
            onClick={() => setViewMode("quiz")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "quiz"
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎯 Simulado Adaptativo
          </button>
          <button
            onClick={() => setViewMode("catalog")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "catalog"
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📖 Catálogo de Estudo
          </button>
        </div>
      </div>

      {/* Painel de fraquezas */}
      {topWeakness.length > 0 && !done && viewMode === "quiz" && (
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
                <Placa id={w.placa} size={32} className="!p-1 !rounded-md" />
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
      {viewMode === "quiz" && (
        <div className="h-2 rounded-full bg-secondary overflow-hidden mb-6">
          <motion.div
            className="h-full gradient-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {viewMode === "catalog" && <PlacasCatalog />}

      {viewMode === "quiz" && !done && (
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
              {q.placa && <Placa id={q.placa} size={200} />}
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
                    ✅ <span className="text-success">{q.options[q.correctIndex]}</span>
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {q.detailedExplanation ?? q.explanation}
                  </p>
                  {q.tip && (
                    <p className="text-sm mt-3 p-2 rounded-lg bg-primary/10 text-primary-glow">
                      💡 <span className="font-semibold">Macete:</span> {q.tip}
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
                {index + 1 >= questions.length ? "Ver resultado" : "Próxima placa"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {done && viewMode === "quiz" && (
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
                  {qq.placa && (
                    <Placa id={qq.placa} size={44} className="!p-1.5 !rounded-lg" />
                  )}
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
            <Sparkles className="h-3 w-3" /> A próxima rodada prioriza as placas
            que você mais errou.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// STUDY SYSTEM DATABASE & COMPONENTS
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

function PlacasCatalog() {
  const [filter, setFilter] = useState<"all" | "regulamentacao" | "advertencia" | "indicacao">("all");
  const [selectedItem, setSelectedItem] = useState<PlacaStudyItem | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return PLACA_STUDY_DATA;
    return PLACA_STUDY_DATA.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            filter === "all"
              ? "bg-zinc-800 border-zinc-700 text-foreground"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-foreground"
          }`}
        >
          Todas as Placas ({PLACA_STUDY_DATA.length})
        </button>
        <button
          onClick={() => setFilter("regulamentacao")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            filter === "regulamentacao"
              ? "bg-destructive/20 border-destructive/40 text-destructive-glow"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-destructive-glow"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Regulamentação ({PLACA_STUDY_DATA.filter((l) => l.type === "regulamentacao").length})
        </button>
        <button
          onClick={() => setFilter("advertencia")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            filter === "advertencia"
              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-amber-400"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Advertência ({PLACA_STUDY_DATA.filter((l) => l.type === "advertencia").length})
        </button>
        <button
          onClick={() => setFilter("indicacao")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            filter === "indicacao"
              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
              : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-blue-400"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Indicação ({PLACA_STUDY_DATA.filter((l) => l.type === "indicacao").length})
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const glowColor =
            item.type === "regulamentacao"
              ? "hover:border-destructive/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
              : item.type === "advertencia"
                ? "hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                : "hover:border-blue-500/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]";

          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`glass rounded-2xl p-5 flex flex-col items-center justify-between gap-4 text-center cursor-pointer transition-all border border-border/30 bg-[#0E101B]/80 ${glowColor}`}
            >
              <div className="w-24 h-24 flex items-center justify-center bg-white/5 rounded-2xl p-2 border border-white/5 shadow-inner">
                <Placa id={item.id} size={70} className="!p-0 !bg-transparent !shadow-none" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-foreground tracking-wide leading-snug">
                  {item.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Plate detail Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-lg w-full rounded-3xl p-6 relative overflow-hidden border border-zinc-800 bg-[#0C0F1A]"
          >
            {/* Top Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Plate frame */}
              <div className="w-36 h-36 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl">
                <Placa id={selectedItem.id} size={110} className="!p-0 !shadow-none !bg-transparent" />
              </div>

              {/* Title & Severity Badge */}
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-display">{selectedItem.title}</h2>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${
                      selectedItem.type === "regulamentacao"
                        ? "bg-destructive/15 border-destructive/35 text-destructive-glow"
                        : selectedItem.type === "advertencia"
                          ? "bg-amber-500/15 border-amber-500/35 text-amber-400"
                          : "bg-blue-500/15 border-blue-500/35 text-blue-400"
                    }`}
                  >
                    {selectedItem.type === "regulamentacao" && "Regulamentação"}
                    {selectedItem.type === "advertencia" && "Advertência"}
                    {selectedItem.type === "indicacao" && "Indicação"}
                  </span>
                </div>
              </div>

              {/* Information body */}
              <div className="w-full text-left space-y-4 pt-2">
                <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Significado Oficial (CTB)
                  </h4>
                  <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {selectedItem.meaning}
                  </p>
                </div>

                <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Dica de Prova / Macete
                  </h4>
                  <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {selectedItem.tip}
                  </p>
                </div>

                {selectedItem.legalBase && (
                  <div className="text-[10px] text-muted-foreground text-right">
                    Base legal: {selectedItem.legalBase}
                  </div>
                )}
              </div>

              {/* Primary action */}
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3.5 rounded-xl font-bold gradient-primary text-primary-foreground text-xs shadow-glow transition-all cursor-pointer"
              >
                Voltar aos Estudos
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
