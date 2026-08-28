import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Check,
  X,
  ImageOff,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  MIG_EXAMPLES,
  MIG_OFFICIAL,
  MIG_QUESTIONS,
  type MIGQuestion,
} from "@/data/raciocinioLogicoMIG";

export const Route = createFileRoute("/raciocinio-logico-mig")({
  component: RaciocinioLogicoMIG,
  head: () => ({
    meta: [
      { title: "Teste de Raciocínio Lógico (MIG) — Nexia" },
      {
        name: "description",
        content:
          "Treine o Teste de Raciocínio Lógico do MIG: nível básico de treino e prova oficial avançada com gabarito.",
      },
    ],
  }),
});

type Level = "hub" | "treino" | "prova" | "result";
type Answer = "A" | "B" | "C" | "D";

const OPTIONS: Answer[] = ["A", "B", "C", "D"];

function RaciocinioLogicoMIG() {
  const [level, setLevel] = useState<Level>("hub");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4" /> Raciocínio Lógico
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">
            Teste <span className="gradient-text">MIG</span> — Prova Oficial
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Resolva questões imagem a imagem e confira seu desempenho com gabarito.
          </p>
        </div>
        {level !== "hub" && (
          <button
            onClick={() => setLevel("hub")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs font-medium hover:bg-accent/30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
        )}
      </div>

      {level === "hub" && <Hub onPick={setLevel} />}
      {level === "treino" && (
        <Solver
          mode="treino"
          questions={MIG_QUESTIONS}
          onFinish={() => setLevel("result")}
        />
      )}
      {level === "prova" && (
        <Solver
          mode="prova"
          questions={MIG_OFFICIAL}
          onFinish={() => setLevel("result")}
        />
      )}
      {level === "result" && <Result onRestart={() => setLevel("hub")} />}
    </div>
  );
}

// ===================== HUB (NÍVEIS) =====================
function Hub({ onPick }: { onPick: (l: Level) => void }) {
  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6 shadow-card">
        <p className="text-sm text-muted-foreground">
          O Teste de Raciocínio Lógico do MIG avalia sua capacidade de identificar
          padrões e relações lógicas. Escolha o nível de dificuldade:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => onPick("treino")}
          className="text-left glass rounded-2xl p-5 hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-success to-primary flex items-center justify-center mb-3 shadow-card">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-xs font-bold text-success uppercase">Nível 1</p>
          <p className="font-semibold mt-0.5">Básico / Treino</p>
          <p className="text-xs text-muted-foreground mt-1">
            {MIG_QUESTIONS.length} questões com feedback imediato. Ideal para
            entender a dinâmica antes da prova.
          </p>
        </button>

        <button
          onClick={() => onPick("prova")}
          className="text-left glass rounded-2xl p-5 hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-glow to-primary flex items-center justify-center mb-3 shadow-card">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-xs font-bold text-primary-glow uppercase">Nível 2</p>
          <p className="font-semibold mt-0.5">Avançado / Prova Oficial MIG</p>
          <p className="text-xs text-muted-foreground mt-1">
            {MIG_OFFICIAL.length} questões sequenciais com gabarito ao final.
            Simulação real da avaliação.
          </p>
        </button>
      </div>

      <Link
        to="/app"
        className="block text-center text-xs text-muted-foreground hover:text-foreground"
      >
        ← Voltar ao painel
      </Link>
    </div>
  );
}

// ===================== SOLVER =====================
function Solver({
  mode,
  questions,
  onFinish,
}: {
  mode: "treino" | "prova";
  questions: MIGQuestion[];
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const total = questions.length;
  const selected = answers[q.id];
  const isLast = index === total - 1;
  const revealOnAnswer = mode === "treino";
  const answered = !!selected;

  const setAnswer = (a: Answer) => {
    if (answered && !revealOnAnswer) return;
    setAnswers((prev) => ({ ...prev, [q.id]: a }));
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      onFinish();
      return;
    }
    setIndex((i) => i + 1);
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setFinished(false);
  };

  const correctCount = useMemo(
    () => questions.filter((qq) => answers[qq.id] === qq.correctAnswer).length,
    [answers, questions],
  );

  if (finished) {
    return (
      <ResultView
        mode={mode}
        questions={questions}
        answers={answers}
        correctCount={correctCount}
        onRestart={restart}
        onHub={() => onFinish()}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {q.title}
        </span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full gradient-primary"
          initial={false}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Image */}
      <div className="glass rounded-3xl p-4 shadow-card">
        <MIGImage url={q.imageUrl} title={q.title} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = q.correctAnswer === opt;
          let cls =
            "border-border/30 bg-white/5 hover:bg-white/10 hover:border-primary/40";
          if (answered) {
            if (revealOnAnswer) {
              if (isCorrect)
                cls = "border-success bg-success/20 shadow-success-glow";
              else if (isSelected)
                cls = "border-destructive bg-destructive/20 shadow-destructive-glow";
              else cls = "border-border/20 bg-white/5 opacity-60";
            } else if (isSelected) {
              cls = "border-primary bg-primary/20";
            }
          }
          return (
            <button
              key={opt}
              onClick={() => setAnswer(opt)}
              disabled={answered && !revealOnAnswer}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all active:scale-95 ${cls}`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-black/30"
                }`}
              >
                {opt}
              </span>
              <span className="text-sm font-semibold">Alternativa {opt}</span>
              {answered && revealOnAnswer && isCorrect && (
                <Check className="h-4 w-4 text-success-glow ml-auto" />
              )}
              {answered && revealOnAnswer && isSelected && !isCorrect && (
                <X className="h-4 w-4 text-destructive-glow ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback (treino) */}
      {answered && revealOnAnswer && (
        <div
          className={`rounded-2xl p-3 text-center text-xs font-semibold border ${
            selected === q.correctAnswer
              ? "border-success/40 bg-success/10 text-success-glow"
              : "border-destructive/40 bg-destructive/10 text-destructive-glow"
          }`}
        >
          {selected === q.correctAnswer
            ? "✓ Resposta correta!"
            : `✗ Gabarito: Alternativa ${q.correctAnswer}`}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-4 py-3 rounded-xl glass text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {!answered ? (
          <button
            disabled
            className="px-5 py-3 rounded-xl glass text-xs font-semibold opacity-40 cursor-not-allowed"
          >
            {isLast ? "Finalizar" : "Próxima"}
          </button>
        ) : (
          <button
            onClick={next}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow active:scale-95 transition-transform"
          >
            {isLast ? "Ver Resultado" : "Próxima"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {mode === "prova" && (
        <p className="text-center text-[10px] text-muted-foreground">
          No modo Prova Oficial o gabarito só é revelado ao final.
        </p>
      )}
    </div>
  );
}

// ===================== IMAGE =====================
function MIGImage({ url, title }: { url: string; title: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <ImageOff className="h-10 w-10" />
        <p className="text-xs">Não foi possível carregar a imagem de “{title}”.</p>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={title}
      loading="lazy"
      onError={() => setErrored(true)}
      className="w-full max-h-[60vh] object-contain rounded-2xl bg-black/30"
    />
  );
}

// ===================== RESULT =====================
function ResultView({
  mode,
  questions,
  answers,
  correctCount,
  onRestart,
  onHub,
}: {
  mode: "treino" | "prova";
  questions: MIGQuestion[];
  answers: Record<number, Answer>;
  correctCount: number;
  onRestart: () => void;
  onHub: () => void;
}) {
  const total = questions.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-6 md:p-8 shadow-card text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-3xl mb-3 shadow-glow">
          🏆
        </div>
        <h2 className="text-2xl font-display font-bold">Teste Finalizado!</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === "prova"
            ? "Prova Oficial MIG concluída."
            : "Treino concluído."}
        </p>
        <p className="text-4xl font-display font-black gradient-text mt-4">
          {correctCount}/{total}
        </p>
        <p className="text-xs text-muted-foreground">Acertos ({pct}%)</p>
      </div>

      {/* Gabarito */}
      <div className="glass rounded-3xl p-4 shadow-card space-y-3">
        <h3 className="text-sm font-display font-bold flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-primary" /> Gabarito
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {questions.map((qq) => {
            const ans = answers[qq.id];
            const ok = ans === qq.correctAnswer;
            return (
              <div
                key={qq.id}
                className="flex items-center gap-2 rounded-xl border border-border/20 bg-black/20 p-2"
              >
                <div className="w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-black/40">
                  <img
                    src={qq.imageUrl}
                    alt={qq.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground truncate">
                    {qq.title}
                  </p>
                  <p className="text-xs font-semibold">
                    Sua: {ans ?? "—"} · Gab: {qq.correctAnswer}
                  </p>
                </div>
                {ok ? (
                  <Check className="h-4 w-4 text-success-glow shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-destructive-glow shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow active:scale-95 transition-transform"
        >
          <RotateCcw className="h-4 w-4" /> Refazer
        </button>
        <button
          onClick={onHub}
          className="px-4 py-3 rounded-xl glass text-xs font-semibold"
        >
          Níveis
        </button>
      </div>
    </div>
  );
}

function Result({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="glass rounded-3xl p-8 text-center shadow-card space-y-4">
      <h2 className="text-xl font-display font-bold">Que tal outro nível?</h2>
      <p className="text-xs text-muted-foreground">
        Volte ao menu e escolha o Nível 1 (Treino) ou o Nível 2 (Prova Oficial).
      </p>
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
      >
        <RotateCcw className="h-4 w-4" /> Escolher Nível
      </button>
    </div>
  );
}
