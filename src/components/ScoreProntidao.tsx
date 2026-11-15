import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Award, Target, TrendingUp } from "lucide-react";
import {
  ACERTOS_NECESSARIOS,
  JANELA_SIMULADOS,
  LIMIAR_NOTA,
  calcularProntidao,
  carregarHistoricoNotas,
  type ResultadoProntidao,
} from "@/lib/prontidao";

// ------------------------------------------------------------
// SCORE DE PRONTIDÃO — bloco visual para o painel do aluno
// ------------------------------------------------------------
// Mostra a barra de progresso + selo de status.
// Regra: gabaritar OU 88%+ em 3 dos últimos 5 simulados.
// ------------------------------------------------------------

type Tom = {
  barra: string;
  selo: string;
  texto: string;
  borda: string;
};

const TONS: Record<Exclude<ResultadoProntidao["statusKey"], "pronto"> | "pronto", Tom> = {
  pronto: {
    barra: "from-success via-success to-primary-glow",
    selo: "bg-success/15 border-success/50 text-success",
    texto: "text-success",
    borda: "border-success/35",
  },
  "quase-la": {
    barra: "from-primary via-primary to-primary-glow",
    selo: "bg-primary/15 border-primary/50 text-primary-glow",
    texto: "text-primary-glow",
    borda: "border-primary/35",
  },
  "em-preparacao": {
    barra: "from-amber-500 via-amber-400 to-primary-glow",
    selo: "bg-amber-500/15 border-amber-500/50 text-amber-400",
    texto: "text-amber-400",
    borda: "border-border/30",
  },
};

function notaTom(pct: number): string {
  if (pct >= 100) return "bg-success/15 text-success border-success/45";
  if (pct >= LIMIAR_NOTA) return "bg-success/10 text-success/90 border-success/30";
  return "bg-destructive/10 text-destructive/90 border-destructive/30";
}

/**
 * Versão autocontida: lê o histórico do aluno no localStorage e desenha o score.
 * Uso: <ScoreProntidao userId={user?.id} />
 */
export function ScoreProntidao({
  userId,
  className = "",
  showCTA = true,
}: {
  userId: string | null | undefined;
  className?: string;
  showCTA?: boolean;
}) {
  const [resultado, setResultado] = useState<ResultadoProntidao>(() => calcularProntidao([]));

  useEffect(() => {
    setResultado(calcularProntidao(carregarHistoricoNotas(userId)));
  }, [userId]);

  return <ScoreProntidaoCard resultado={resultado} className={className} showCTA={showCTA} />;
}

/**
 * Versão pura: recebe o resultado já calculado (ex.: na tela de resultado
 * do simulado, onde a nota acabou de ser gravada).
 */
export function ScoreProntidaoCard({
  resultado,
  className = "",
  showCTA = true,
}: {
  resultado: ResultadoProntidao;
  className?: string;
  showCTA?: boolean;
}) {
  const tom = TONS[resultado.statusKey];
  const seloIcone = resultado.isReady ? Award : resultado.statusKey === "quase-la" ? Target : TrendingUp;
  const Icone = seloIcone;
  const pronto = resultado.isReady;

  return (
    <div
      className={`glass rounded-3xl border ${tom.borda} p-5 md:p-6 shadow-glow ${className}`}
      data-testid="score-prontidao"
    >
      {/* Cabeçalho + selo de status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-primary-glow font-bold">
            Score de Prontidão
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Baseado nos seus últimos {JANELA_SIMULADOS} simulados
          </p>
        </div>

        {/* SELO */}
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${tom.selo}`}
        >
          <Icone className="h-3.5 w-3.5" />
          {pronto ? "PRONTO" : resultado.statusKey === "quase-la" ? "QUASE LÁ" : "EM PREPARAÇÃO"}
        </span>
      </div>

      {/* Percentual + barra de progresso */}
      <div className="mt-4 space-y-2">
        <div className="flex items-end justify-between gap-2">
          <span className={`font-display font-bold text-4xl leading-none ${tom.texto}`}>
            {resultado.readiness}
            <span className="text-lg text-muted-foreground">%</span>
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {pronto
              ? "Janela completa · regra cumprida ✅"
              : !resultado.janelaCompleta
                ? `${resultado.janela.length}/${JANELA_SIMULADOS} simulados na janela`
                : `${resultado.noPadrao}/${ACERTOS_NECESSARIOS} simulados a ${LIMIAR_NOTA}%+`}
          </span>
        </div>

        {/* Barra */}
        <div
          className="h-3 w-full rounded-full bg-background/60 border border-border/25 overflow-hidden"
          role="progressbar"
          aria-valuenow={resultado.readiness}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Score de prontidão"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${resultado.readiness}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${tom.barra} shadow-glow`}
          />
        </div>
      </div>

      {/* Mensagem / próximo passo */}
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{resultado.mensagem}</p>

      {/* Selo de status em texto (destaque) */}
      <div
        className={`mt-3 rounded-2xl border px-4 py-3 flex items-center gap-2.5 ${
          pronto ? "border-success/40 bg-success/10" : "border-border/25 bg-background/40"
        }`}
      >
        <span className="text-lg leading-none">{pronto ? "🚀" : resultado.statusKey === "quase-la" ? "🎯" : "🌱"}</span>
        <p
          className={`text-sm font-semibold leading-tight ${
            pronto ? "text-success" : "text-foreground"
          }`}
        >
          {resultado.status}
        </p>
      </div>

      {/* Últimos simulados da janela */}
      {resultado.janela.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
            Últimos {resultado.janela.length} de {JANELA_SIMULADOS}
          </p>
          <div className="flex flex-wrap gap-2">
            {resultado.janela.map((pct, i) => (
              <span
                key={`${i}-${pct}`}
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold tabular-nums ${notaTom(pct)}`}
                title={pct >= LIMIAR_NOTA ? "Simulado dentro do padrão" : "Abaixo de 88%"}
              >
                {pct >= 100 ? "100% ★" : `${pct}%`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Regra + CTA */}
      <div className="mt-4 pt-3 border-t border-border/20 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] text-muted-foreground leading-snug max-w-[60%]">
          Regra: gabaritar <span className="text-foreground/80">(100%)</span> ou fazer{" "}
          <span className="text-foreground/80">{LIMIAR_NOTA}%+</span> em{" "}
          <span className="text-foreground/80">
            {ACERTOS_NECESSARIOS} dos últimos {JANELA_SIMULADOS}
          </span>
          .
        </p>

        {showCTA && !pronto && (
          <Link
            to="/simulado"
            search={{ modo: "completo", categoria: undefined }}
            className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-4 py-2 text-[11px] font-bold text-primary-foreground shadow-glow hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Fazer simulado
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
