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

      {/* Level progress */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-lg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <div className="relative flex items-center gap-3">
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary-glow">
            Nível 7
          </span>
          <div
            className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Progresso para o próximo nível"
            aria-valuenow={68}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full gradient-primary"
            />
          </div>
          <span className="shrink-0 tabular-nums text-[11px] font-medium text-muted-foreground">
            3.420 / 5.000 XP
          </span>
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
