import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, ArrowLeft, RotateCcw, GraduationCap, Sparkles } from "lucide-react";
import {
  MIG_OFFICIAL,
  MIG_QUESTIONS,
} from "@/data/raciocinioLogicoMIG";
import { RaciocinioMIGQuiz } from "@/components/RaciocinioMIGQuiz";

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
        <RaciocinioMIGQuiz
          mode="treino"
          questions={MIG_QUESTIONS}
          timeLimit={120}
          onFinish={() => setLevel("result")}
          onHub={() => setLevel("hub")}
        />
      )}
      {level === "prova" && (
        <RaciocinioMIGQuiz
          mode="prova"
          questions={MIG_OFFICIAL}
          timeLimit={120}
          onFinish={() => setLevel("result")}
          onHub={() => setLevel("hub")}
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
