import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  QUESTIONS,
  INCIDENCE_META,
  CATEGORY_LABELS,
  type Incidence,
  type Category,
} from "@/data/questions";
import { Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/mais-caem")({
  component: MaisCaem,
  head: () => ({
    meta: [
      { title: "Questões que Mais Caem — Nexia DETRAN" },
      {
        name: "description",
        content:
          "Ranking das questões mais recorrentes na prova teórica do DETRAN. Foque no essencial.",
      },
    ],
  }),
});

const INCIDENCES: Incidence[] = ["altissima", "alta", "media", "baixa"];

function MaisCaem() {
  const [inc, setInc] = useState<Incidence | "all">("all");
  const [cat, setCat] = useState<Category | "all">("all");

  const list = useMemo(() => {
    return QUESTIONS.filter(
      (q) =>
        (inc === "all" || q.incidence === inc) &&
        (cat === "all" || q.category === cat),
    ).sort(
      (a, b) =>
        INCIDENCE_META[b.incidence].weight - INCIDENCE_META[a.incidence].weight,
    );
  }, [inc, cat]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-destructive font-semibold flex items-center gap-2">
            <Flame className="h-4 w-4" /> Prioridade máxima
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-1">
            Questões que <span className="gradient-text">mais caem</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Ranking baseado em incidência real. Domine essas e seu desempenho
            dispara.
          </p>
        </div>
        <Link
          to="/simulado"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow text-sm"
        >
          <Sparkles className="h-4 w-4" /> Treinar agora
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={inc === "all"} onClick={() => setInc("all")}>
            Todas incidências
          </FilterChip>
          {INCIDENCES.map((i) => (
            <FilterChip
              key={i}
              active={inc === i}
              onClick={() => setInc(i)}
            >
              {INCIDENCE_META[i].emoji} {INCIDENCE_META[i].label}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            Todas categorias
          </FilterChip>
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
              {CATEGORY_LABELS[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {list.map((q, i) => {
          const m = INCIDENCE_META[q.incidence];
          return (
            <motion.li
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="glass rounded-2xl p-4 md:p-5 flex gap-4 items-start hover:bg-accent/20 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center font-display font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${m.className}`}>
                    {m.emoji} {m.label}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-secondary/50">
                    {CATEGORY_LABELS[q.category]}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-secondary/50">
                    Dif. {q.difficulty}/3
                  </span>
                </div>
                <p className="text-sm md:text-base font-medium leading-snug">
                  {q.statement}
                </p>
              </div>
            </motion.li>
          );
        })}
        {list.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nenhuma questão com esses filtros.
          </p>
        )}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-glow"
          : "bg-secondary/40 border-border hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
