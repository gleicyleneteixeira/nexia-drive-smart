import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  ImageOff,
  Timer,
} from "lucide-react";
import { type MIGQuestion } from "@/data/raciocinioLogicoMIG";

type Answer = "A" | "B" | "C" | "D";
const OPTIONS: Answer[] = ["A", "B", "C", "D"];
const PASSING_SCORE = 20; // mínimo de 20 acertos (de 28) para aprovação no MIG

export function RaciocinioMIGQuiz({
  mode,
  questions,
  timeLimit = 300,
  onFinish,
  onHub,
  isAdminPreview = false,
}: {
  mode: "treino" | "prova";
  questions: MIGQuestion[];
  timeLimit?: number;
  onFinish: () => void;
  onHub: () => void;
  isAdminPreview?: boolean;
}) {
  const STORAGE_KEY = `mig_session_${mode}`;

  const restoreSession = () => {
    if (isAdminPreview) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw) as {
        index: number;
        answers: Record<number, Answer>;
        timeLeft: number;
      };
      if (typeof s?.index !== "number" || typeof s?.answers !== "object") return null;
      return s;
    } catch {
      return null;
    }
  };

  const savedSession = restoreSession();

  const [index, setIndex] = useState(
    savedSession ? Math.min(savedSession.index, questions.length - 1) : 0,
  );
  const [answers, setAnswers] = useState<Record<number, Answer>>(
    savedSession ? (savedSession.answers as Record<number, Answer>) : {},
  );
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    savedSession ? savedSession.timeLeft : timeLimit,
  );
  const [pageInput, setPageInput] = useState("");
  const [autoAdvancing, setAutoAdvancing] = useState(false);

  // Persiste o progresso para retomada após troca de aba/navegação
  useEffect(() => {
    if (isAdminPreview || finished) {
      if (!isAdminPreview) localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ index, answers, timeLeft }),
    );
  }, [index, answers, timeLeft, finished, isAdminPreview, STORAGE_KEY]);

  const q = questions[index];
  const total = questions.length;
  const selected = answers[q.id];
  const isLast = index === total - 1;
  const answered = !!selected;

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  // Cronômetro global de prova (desativado no modo admin de divulgação)
  useEffect(() => {
    if (finished || isAdminPreview) return;
    if (timeLeft <= 0) {
      setFinished(true);
      onFinishRef.current();
      return;
    }
    const id = setTimeout(
      () => setTimeLeft((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => clearTimeout(id);
  }, [timeLeft, finished, isAdminPreview, onFinishRef]);

  const setAnswer = (a: Answer) => {
    if (answered) return;
    setAnswers((prev) => ({ ...prev, [q.id]: a }));
    if (isAdminPreview) {
      setAutoAdvancing(true);
    }
  };

  // Auto-advance after 0.5s when in admin preview
  useEffect(() => {
    if (!isAdminPreview || !autoAdvancing || !answered) return;
    const timer = setTimeout(() => {
      if (isLast) {
        setFinished(true);
        onFinishRef.current();
      } else {
        setIndex((i) => Math.min(total - 1, i + 1));
      }
      setAutoAdvancing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAdminPreview, autoAdvancing, answered, isLast, total]);

  const next = () => {
    if (isLast) {
      setFinished(true);
      onFinishRef.current();
      return;
    }
    setIndex((i) => Math.min(total - 1, i + 1));
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const goToPage = (num: number) => {
    const n = Math.max(1, Math.min(total, num));
    setIndex(n - 1);
    setPageInput("");
    setAutoAdvancing(false);
  };

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
      {!isAdminPreview && (
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
      )}

      {/* Image com animação de virada de página */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 48, rotateY: 12 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -48, rotateY: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="glass rounded-3xl p-4 shadow-card [transform-style:preserve-3d]"
          style={{ perspective: 1000 }}
        >
          <MIGImage url={q.imageUrl} title={q.title} />
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = q.correctAnswer === opt;
          let cls =
            "border-border/30 bg-white/5 hover:bg-white/10 hover:border-primary/40";
          if (answered) {
            if (isAdminPreview) {
              if (isCorrect)
                cls = "border-success bg-success/20 shadow-success-glow";
              else if (isSelected)
                cls = "border-destructive bg-destructive/20 shadow-destructive-glow";
              else cls = "border-border/20 bg-white/5 opacity-60";
            } else {
              // Modo usuário: não revela o gabarito, apenas destaca a selecionada
              if (isSelected) cls = "border-primary bg-primary/20";
              else cls = "border-border/20 bg-white/5 opacity-60";
            }
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
              {answered && isAdminPreview && isCorrect && (
                <Check className="h-4 w-4 text-success-glow ml-auto" />
              )}
              {answered && isAdminPreview && isSelected && !isCorrect && (
                <X className="h-4 w-4 text-destructive-glow ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback (modo admin) — revela gabarito e justificativa na hora */}
      {answered && isAdminPreview && (
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
        </div>
      )}

      {/* Navegação: admin tem input de página, não tem botão Próxima */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {isAdminPreview ? (
          <>
            <button
              onClick={prev}
              disabled={index === 0 || autoAdvancing}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl glass text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" /> Anterior
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Ir p/</span>
              <input
                type="number"
                min={1}
                max={total}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pageInput) goToPage(Number(pageInput));
                }}
                onBlur={() => { if (pageInput) goToPage(Number(pageInput)); }}
                placeholder="#"
                className="w-14 h-9 rounded-lg border border-border/30 bg-white/5 text-center text-xs font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">/ {total}</span>
            </div>
            {isLast && answered && !autoAdvancing && (
              <button
                onClick={() => { setFinished(true); onFinishRef.current(); }}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold shadow-glow active:scale-95 transition-transform"
              >
                Ver Resultado
              </button>
            )}
            {!isLast && <div className="w-[120px]" />}
          </>
        ) : (
          <>
            <button
              onClick={prev}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl glass text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" /> Anterior
            </button>
            <button
              onClick={next}
              disabled={!answered}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold shadow-glow active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLast ? "Ver Resultado" : "Próxima ➔"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        {isAdminPreview
          ? "Clique na resposta para ver o gabarito. Avança automaticamente em 0.5s. Use o campo de página para pular direto."
          : "Selecione uma alternativa e avance com o botão Próxima. O gabarito completo só é revelado ao final do teste."}
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
  const passMin = PASSING_SCORE;
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
          Acertos em questões oficiais ({pct}%) · mínimo p/ aprovação: {passMin} acertos
        </p>
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
