import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  JANELA_SIMULADOS,
  calcularProntidao,
  carregarHistoricoNotas,
  type ResultadoProntidao,
} from "@/lib/prontidao";

// ------------------------------------------------------------
// SCORE DE PRONTIDÃO — bloco visual para o painel do aluno
// ------------------------------------------------------------
// Mostra a barra de progresso + selo de status.
// Só conta simulado GERAL; a contagem zera todo dia e forma
// blocos de 5. Regra (avaliada no 5º do bloco): gabaritar OU
// 88%+ em 3 dos 5 simulados do bloco.
// ------------------------------------------------------------

type Tom = {
  barra: string;
  selo: string;
  texto: string;
};

const TONS: Record<Exclude<ResultadoProntidao["statusKey"], "pronto"> | "pronto", Tom> = {
  pronto: {
    barra: "from-success via-success to-primary-glow",
    selo: "bg-success/15 border-success/50 text-success",
    texto: "text-success",
  },
  "quase-la": {
    barra: "from-primary via-primary to-primary-glow",
    selo: "bg-primary/15 border-primary/50 text-primary-glow",
    texto: "text-primary-glow",
  },
  "em-preparacao": {
    barra: "from-amber-500 via-amber-400 to-primary-glow",
    selo: "bg-amber-500/15 border-amber-500/50 text-amber-400",
    texto: "text-amber-400",
  },
};

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
  const pronto = resultado.isReady;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-lg ${className}`}
      data-testid="score-prontidao"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="relative flex min-h-5 items-center gap-2 sm:gap-3">
        <span
          title="Nível de preparo para a prova"
          className="shrink-0 text-[10px] font-semibold text-muted-foreground"
        >
          <span className="sm:hidden">Nível</span>
          <span className="hidden sm:inline">Nível de preparo</span>
        </span>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold leading-none ${tom.selo}`}
        >
          {resultado.status}
        </span>
        <div
          className="h-1 min-w-4 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={resultado.readiness}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Score de prontidão"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${resultado.readiness}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${tom.barra}`}
          />
        </div>
        <span className={`shrink-0 tabular-nums text-[10px] font-semibold ${tom.texto}`}>
          {resultado.readiness}%
        </span>
        <span
          title={`${resultado.bloco.length} de ${JANELA_SIMULADOS} simulados no bloco de hoje`}
          className="shrink-0 tabular-nums text-[10px] text-muted-foreground"
        >
          {resultado.bloco.length}/{JANELA_SIMULADOS}
        </span>

        {showCTA && !pronto && (
          <Link
            to="/simulado"
            search={{ modo: "completo", categoria: undefined }}
            aria-label="Fazer simulado"
            title="Fazer simulado"
            className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary-glow transition-colors hover:bg-white/10 sm:inline-flex"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
