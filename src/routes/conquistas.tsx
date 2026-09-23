import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Flame, Zap, Target, Star, Shield, Crown, Brain } from "lucide-react";

export const Route = createFileRoute("/conquistas")({
  component: ConquistasPage,
  head: () => ({
    meta: [
      { title: "Conquistas — Nexia DETRAN" },
      {
        name: "description",
        content: "Medalhas, ranking e progresso gamificado da sua jornada.",
      },
    ],
  }),
});

const MEDALS = [
  { e: "🚦", n: "Mestre das Placas", d: "100 questões de placas", got: true, icon: Trophy },
  { e: "🧠", n: "Rei das Pegadinhas", d: "30 pegadinhas acertadas", got: true, icon: Brain },
  { e: "🛡️", n: "Direção Defensiva", d: "Nível 5 atingido", got: true, icon: Shield },
  { e: "🔥", n: "Streak 7 dias", d: "Estudo diário", got: true, icon: Flame },
  { e: "⚡", n: "Reflexo Rápido", d: "10 acertos em < 5s", got: true, icon: Zap },
  { e: "🎯", n: "Atirador Certeiro", d: "20 acertos seguidos", got: false, icon: Target },
  { e: "👑", n: "Aprovado", d: "Simulado 100%", got: false, icon: Crown },
  { e: "⭐", n: "Estrela do DETRAN", d: "Top 10 ranking", got: false, icon: Star },
];

const RANK = [
  { p: "Você", xp: 3420, me: true },
  { p: "Júlia M.", xp: 5210 },
  { p: "Carlos R.", xp: 4890 },
  { p: "Ana P.", xp: 4120 },
  { p: "Bruno T.", xp: 2980 },
];

function ConquistasPage() {
  const sorted = [...RANK].sort((a, b) => b.xp - a.xp);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-warning font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4" /> Sua jornada
        </p>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-1">
          Conquistas & <span className="gradient-text">ranking</span>
        </h1>
      </div>

      {/* Level card */}
      <div className="glass rounded-3xl p-6 shadow-card flex items-center gap-6 flex-wrap">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow text-3xl font-display font-bold text-primary-foreground">
          7
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm text-muted-foreground">Nível atual</p>
          <p className="text-2xl font-display font-bold">Aprendiz Veterano</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>3.420 XP</span>
              <span className="text-muted-foreground">5.000 XP</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ duration: 0.8 }}
                className="h-full gradient-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              1.580 XP para o próximo nível
            </p>
          </div>
        </div>
      </div>

      {/* Medals */}
      <section>
        <h2 className="text-lg font-display font-bold mb-3">Medalhas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MEDALS.map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass rounded-2xl p-4 text-center ${
                !m.got ? "opacity-40 grayscale" : ""
              }`}
            >
              <div className="text-4xl mb-2">{m.e}</div>
              <p className="font-semibold text-sm">{m.n}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{m.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ranking */}
      <section>
        <h2 className="text-lg font-display font-bold mb-3">Ranking semanal</h2>
        <ul className="space-y-2">
          {sorted.map((r, i) => (
            <li
              key={r.p}
              className={`glass rounded-2xl p-4 flex items-center gap-4 ${
                r.me ? "border-primary/40 ring-1 ring-primary/30" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold ${
                  i === 0
                    ? "bg-warning text-warning-foreground"
                    : i === 1
                      ? "bg-muted text-foreground"
                      : i === 2
                        ? "bg-destructive/30 text-destructive"
                        : "bg-secondary/60"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {r.p}
                  {r.me && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary-glow border border-primary/30">
                      VOCÊ
                    </span>
                  )}
                </p>
              </div>
              <p className="font-display font-bold text-primary-glow">
                {r.xp.toLocaleString("pt-BR")} XP
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
