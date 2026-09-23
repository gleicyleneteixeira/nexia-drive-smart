import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  QUESTIONS,
  CATEGORY_LABELS,
  INCIDENCE_META,
  REAL_EXAM_IDS,
  type Question,
  type Category,
} from "@/data/questions";
import { Placa } from "@/components/Placa";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Lightbulb,
  AlertTriangle,
  Scale,
  Brain,
  RotateCcw,
  ListChecks,
} from "lucide-react";

// Espelho do simulado: mostra apenas as questões que caíram na prova real (REAL_EXAM_IDS),
// com a mesma aparência do simulado, para uso exclusivo do super admin na criação de conteúdo.
// Importante: este componente NÃO usa localStorage nem dispara avaliação/popups,
// para não interferir em nada do simulado real nem do teste grátis.

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

export function SimuladoEspelho({ onExit }: { onExit: () => void }) {
  const questions = useMemo(
    () => QUESTIONS.filter((q) => REAL_EXAM_IDS.includes(q.id)),
    [],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">
        Nenhuma questão real encontrada no banco.
      </div>
    );
  }

  const q = questions[Math.min(index, questions.length - 1)];

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
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

  function back() {
    if (index > 0) {
      const prev = index - 1;
      setIndex(prev);
      setSelected(answers[prev] ?? null);
    } else {
      onExit();
    }
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
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
    ((Math.min(index, questions.length) + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {!done && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={back}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">
                Simulado Inteligente
              </p>
              <h1 className="text-xl md:text-2xl font-display font-bold">
                Questão {Math.min(index + 1, questions.length)}{" "}
                <span className="text-muted-foreground text-base font-normal">
                  / {questions.length}
                </span>
              </h1>
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

          {/* Progress */}
          <div className="h-2 rounded-full bg-secondary overflow-hidden mb-6">
            <motion.div
              className="h-full gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

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
              <h2 className="text-lg md:text-xl font-medium leading-relaxed">{q.statement}</h2>

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
                {selected !== null && <EspelhoFeedback q={q} selected={selected} />}
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
        </>
      )}

      {/* Tela final */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-3xl p-6 md:p-8 shadow-glow"
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-glow ${
                  score === questions.length ? "bg-success" : "bg-primary"
                }`}
              >
                <Check className="h-10 w-10 text-success-foreground" />
              </div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 bg-primary/15 text-primary-glow border border-primary/40">
                Espelho finalizado
              </span>
              <h2 className="text-3xl font-display font-bold">
                {score}/{questions.length}{" "}
                <span className="text-lg text-muted-foreground">({Math.round((score / questions.length) * 100)}%)</span>
              </h2>
              <p className="text-muted-foreground mt-1">
                Questões que realmente caíram na prova do DETRAN.
              </p>
            </div>

            <div className="mt-6 grid gap-2">
              <button
                onClick={restart}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
              >
                <RotateCcw className="h-4 w-4" />
                Refazer espelho
              </button>
              <button
                onClick={onExit}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold hover:bg-accent/30 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao painel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rodapé discreto de contexto interno (não aparece no fluxo de questões) */}
      <p className="mt-6 text-center text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5">
        <ListChecks className="h-3.5 w-3.5" />
        Espelho interno — apenas as questões que caíram na prova
      </p>
    </div>
  );
}

function EspelhoFeedback({ q, selected }: { q: Question; selected: number }) {
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
        <p className="text-sm text-foreground/90 leading-relaxed">{getMemoryHook(q)}</p>
      </div>
    </motion.div>
  );
}
