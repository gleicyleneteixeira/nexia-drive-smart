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
  const [showAnswer, setShowAnswer] = useState(false);

  function advance(dir: 1 | -1) {
    setShowAnswer(false);
    setI((prev) => Math.max(0, Math.min(cards.length - 1, prev + dir)));
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 80) {
      advance(info.offset.x < 0 ? 1 : -1);
    }
  }

  const q = cards[i];
  const m = INCIDENCE_META[q.incidence];
  const done = i >= cards.length - 1 && showAnswer;

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
        </div>
        <button
          onClick={() => {
            setSeed((s) => s + 1);
            setI(0);
            setShowAnswer(false);
          }}
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

            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 12, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-4 rounded-2xl border border-success/30 bg-success/10">
                    <p className="text-xs uppercase tracking-wide text-success font-semibold mb-1">
                      Resposta
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

            <button
              onClick={() => setShowAnswer((v) => !v)}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass font-medium text-sm hover:bg-accent/30"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4" /> Ocultar
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" /> Ver resposta
                </>
              )}
            </button>
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
              setSeed((s) => s + 1);
              setI(0);
              setShowAnswer(false);
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
