import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Check,
  X,
  ImageOff,
  Timer,
} from "lucide-react";
import { type MIGQuestion } from "@/data/raciocinioLogicoMIG";

type Answer = "A" | "B" | "C" | "D";
const OPTIONS: Answer[] = ["A", "B", "C", "D"];

export function RaciocinioMIGQuiz({
  mode,
  questions,
  timeLimit = 120,
  onFinish,
  onHub,
}: {
  mode: "treino" | "prova";
  questions: MIGQuestion[];
  timeLimit?: number;
  onFinish: () => void;
  onHub: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const q = questions[index];
  const total = questions.length;
  const selected = answers[q.id];
  const isLast = index === total - 1;
  const answered = !!selected;

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  // Cronômetro global de prova
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      onFinishRef.current();
      return;
    }
    const id = setTimeout(
      () => setTimeLeft((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => clearTimeout(id);
  }, [timeLeft, finished, onFinishRef]);

  const setAnswer = (a: Answer) => {
    if (answered) return;
    setAnswers((prev) => ({ ...prev, [q.id]: a }));
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      onFinishRef.current();
      return;
    }
    setIndex((i) => i + 1);
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setTimeLeft(timeLimit);
  };

  if (finished) {
    return (
      <ResultView
        mode={mode}
        questions={questions}
        answers={answers}
        onRestart={restart}
        onHub={onHub}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress + timer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{q.title}</span>
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
      <div className="flex items-center justify-end gap-1.5 text-xs font-semibold">
        <Timer
          className={`h-4 w-4 ${
            timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary"
          }`}
        />
        <span
          className={`font-display font-bold ${
            timeLeft <= 10 ? "text-destructive" : "text-foreground"
          }`}
        >
          {timeLeft}s
        </span>
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
            if (isCorrect)
              cls = "border-success bg-success/20 shadow-success-glow";
            else if (isSelected)
              cls = "border-destructive bg-destructive/20 shadow-destructive-glow";
            else cls = "border-border/20 bg-white/5 opacity-60";
          }
          return (
            <button
              key={opt}
              onClick={() => setAnswer(opt)}
              disabled={answered}
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
              {answered && isCorrect && (
                <Check className="h-4 w-4 text-success-glow ml-auto" />
              )}
              {answered && isSelected && !isCorrect && (
                <X className="h-4 w-4 text-destructive-glow ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
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
          <p className="mt-1 font-normal text-muted-foreground">
            {q.justification ??
              "No Teste de Atenção Concentrada, observe a relação lógica entre as figuras para identificar o padrão correto."}
          </p>
          <button
            onClick={next}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-glow active:scale-95 transition-transform"
          >
            {isLast ? "Ver Resultado" : "Próxima ➔"}
            <ArrowRight className="h-4 w-4" />
          </button>
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
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        Após responder, o gabarito e a justificativa aparecem abaixo. Avance com o
        botão “Próxima”.
      </p>
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
  onRestart,
  onHub,
}: {
  mode: "treino" | "prova";
  questions: MIGQuestion[];
  answers: Record<number, Answer>;
  onRestart: () => void;
  onHub: () => void;
}) {
  const official = useMemo(
    () => questions.filter((q) => !q.isExample),
    [questions],
  );
  const officialTotal = official.length;
  const officialCorrect = official.filter(
    (q) => answers[q.id] === q.correctAnswer,
  ).length;
  const pct =
    officialTotal > 0
      ? Math.round((officialCorrect / officialTotal) * 100)
      : 0;
  const passMin = Math.ceil(officialTotal * 0.6);
  const isPassed = officialCorrect >= passMin;

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-6 md:p-8 shadow-card text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-3xl mb-3 shadow-glow">
          🏆
        </div>
        <div
          className={`text-4xl font-display font-black mt-2 ${
            isPassed ? "text-success" : "text-destructive"
          }`}
        >
          {isPassed ? "Aprovado! 🎉" : "Reprovado ❌"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === "prova"
            ? "Prova Oficial MIG concluída."
            : "Treino concluído."}
        </p>
        <p className="text-4xl font-display font-black gradient-text mt-4">
          {officialCorrect}
          <span className="text-xl opacity-70">/{officialTotal}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Acertos em questões oficiais ({pct}%) · mínimo p/ aprovação: {passMin}
        </p>
      </div>

      {/* Gabarito */}
      <div className="glass rounded-3xl p-4 shadow-card space-y-3">
        <h3 className="text-sm font-display font-bold flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-primary" /> Gabarito Completo
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
                    {qq.isExample && " · Exemplo"}
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
          <RotateCcw className="h-4 w-4" /> Refazer Teste
        </button>
        <button
          onClick={onHub}
          className="px-4 py-3 rounded-xl glass text-xs font-semibold flex items-center gap-2"
        >
          Próximo Teste ➔
        </button>
      </div>
    </div>
  );
}
