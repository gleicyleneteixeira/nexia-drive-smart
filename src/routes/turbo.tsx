import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  getRandomizedQuestions,
  CATEGORY_LABELS,
  INCIDENCE_META,
} from "@/data/questions";
import { Eye, EyeOff, RotateCcw, Zap } from "lucide-react";

export const Route = createFileRoute("/turbo")({
  component: TurboPage,
  head: () => ({
    meta: [
      { title: "Revisão Turbo — Nexia DETRAN" },
      {
        name: "description",
        content:
          "Memorização rápida no estilo cards swipe. Revise antes da prova em minutos.",
      },
    ],
  }),
});

function TurboPage() {
  const [seed, setSeed] = useState(0);
  const cards = useMemo(() => getRandomizedQuestions(15), [seed]);
  const [i, setI] = useState(0);
  // Tentativa do cartão atual (índice) + revelar sem pontuar
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const resetCard = () => {
    setPicked(null);
    setRevealed(false);
  };

  function advance(dir: 1 | -1) {
    resetCard();
    setI((prev) => Math.max(0, Math.min(cards.length - 1, prev + dir)));
  }

  function reshuffle() {
    setSeed((s) => s + 1);
    setI(0);
    resetCard();
    setHits(0);
    setMisses(0);
  }

  function pick(idx: number) {
    if (picked !== null || revealed) return;
    setPicked(idx);
    if (idx === q.correctIndex) {
      setHits((h) => h + 1);
    } else {
      setMisses((m) => m + 1);
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 80) {
      advance(info.offset.x < 0 ? 1 : -1);
    }
  }

  const q = cards[i];
  const m = INCIDENCE_META[q.incidence];
  const answered = picked !== null || revealed;
  const done = i >= cards.length - 1 && answered;
  const LETTERS = ["A", "B", "C", "D"];

  return (
    <div className="mx-auto max-w-md px-4 py-6 md:py-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-warning font-semibold flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Revisão Turbo
          </p>
          <h1 className="text-xl font-display font-bold">
            Card {i + 1} / {cards.length}
          </h1>
          {(hits > 0 || misses > 0) && (
            <p className="text-xs font-semibold mt-0.5">
              <span className="text-success">✅ {hits}</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-destructive">❌ {misses}</span>
            </p>
          )}
        </div>
        <button
          onClick={reshuffle}
          className="p-2 rounded-xl glass hover:bg-accent/30"
          aria-label="Reembaralhar"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-5">
        <motion.div
          className="h-full bg-warning"
          animate={{ width: `${((i + 1) / cards.length) * 100}%` }}
        />
      </div>

      <div className="relative min-h-[440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${seed}-${i}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -50 }}
            transition={{ duration: 0.25 }}
            className="relative w-full glass rounded-3xl p-6 shadow-card cursor-grab active:cursor-grabbing flex flex-col"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${m.className}`}>
                {m.emoji} {m.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-secondary/50">
                {CATEGORY_LABELS[q.category]}
              </span>
            </div>

            <p className="text-base font-medium leading-relaxed flex-1">
              {q.statement}
            </p>

            {/* Opções para tentar responder */}
            <div className="mt-4 space-y-2">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.correctIndex;
                const isPicked = picked === idx;
                const locked = answered;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={locked}
                    onClick={() => pick(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                      locked && isCorrect
                        ? "border-success/50 bg-success/10 text-foreground font-semibold"
                        : locked && isPicked
                          ? "border-destructive/50 bg-destructive/10 text-foreground"
                          : locked
                            ? "border-border/40 bg-background/30 text-muted-foreground"
                            : "border-border/40 bg-background/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                    }`}
                  >
                    <span className="font-bold mr-2">{LETTERS[idx] ?? idx + 1}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 12, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-4 rounded-2xl border border-success/30 bg-success/10">
                    <p className="text-xs uppercase tracking-wide text-success font-semibold mb-1">
                      {revealed && picked === null
                        ? "Resposta"
                        : picked === q.correctIndex
                          ? "Acertou! 🎉"
                          : "Não foi dessa vez"}
                    </p>
                    <p className="font-semibold text-sm">
                      {q.options[q.correctIndex]}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {q.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!answered && (
              <button
                onClick={() => setRevealed(true)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground"
              >
                <Eye className="h-3.5 w-3.5" /> Não sei, ver resposta
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => advance(-1)}
          disabled={i === 0}
          className="px-4 py-3 rounded-xl glass font-medium text-sm disabled:opacity-40"
        >
          ← Anterior
        </button>
        <button
          onClick={() => {
            if (done) {
              reshuffle();
            } else {
              advance(1);
            }
          }}
          className="px-4 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow"
        >
          {done ? "Recomeçar" : "Próximo →"}
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">
        Deslize ← → para navegar
      </p>
    </div>
  );
}
