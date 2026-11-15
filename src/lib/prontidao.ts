// ============================================================
// SCORE DE PRONTIDÃO — Simulado Nexia Drive
// ------------------------------------------------------------
// REGRA DE NEGÓCIO (exata):
//   • O sistema analisa SEMPRE a janela com os ÚLTIMOS 5 simulados
//     consecutivos realizados pelo aluno — e a janela precisa estar
//     COMPLETA (5 simulados) para abrir a trava.
//   • O aluno está PRONTO se, fechada a janela de 5:
//       a) GABARITAR (100%) em qualquer um desses 5 simulados, OU
//       b) acertar no mínimo 88% em pelo menos 3 desses 5 simulados.
//     → Sem os 5 simulados avaliados, NÃO libera: a prova exige
//       consistência real, não um único bom resultado.
//
// SAÍDA:
//   • readiness: 0–100 (só chega a 100 quando a regra é batida)
//   • status: texto ("Em preparação" | "Quase lá" | "🚀 Pronto…")
//   • isReady: trava booleana para liberar/marcar a prova
// ============================================================

export const JANELA_SIMULADOS = 5;
export const LIMIAR_NOTA = 88; // mínimo de aproveitamento por simulado
export const ACERTOS_NECESSARIOS = 3; // de 5 precisam chegar a 88%

export type StatusProntidao = "em-preparacao" | "quase-la" | "pronto";

/** Registro bruto de um simulado concluído. */
export interface NotaSimulado {
  pct: number; // aproveitamento 0–100
  em: string; // ISO date
  modo?: string; // "completo" | "prova-real" | categoria
}

export interface ResultadoProntidao {
  /** Percentual de prontidão (0–100). Igual a 100 ⟺ isReady === true. */
  readiness: number;
  /** Texto do status para exibir ao aluno. */
  status: string;
  /** Trava: true quando a regra de prontidão foi satisfeita. */
  isReady: boolean;
  /** Classificação estruturada (útil para estilizar/tomar decisão). */
  statusKey: StatusProntidao;
  /** Últimas notas analisadas, mais recente primeiro (máx. 5). */
  janela: number[];
  /** Melhor nota da janela (0 quando não há histórico). */
  melhorNota: number;
  /** Quantos simulados da janela chegaram a >= 88%. */
  noPadrao: number;
  /** Quantos simulados ainda faltam para a janela de 5 estar completa. */
  faltamSimulados: number;
  /** true quando já há 5 simulados na janela (pré-requisito da trava). */
  janelaCompleta: boolean;
  /** Quanto falta para a regra "3 de 5 a 88%+" (0 quando pronta). */
  faltam: number;
  /** Linha de apoio explicando o próximo passo. */
  mensagem: string;
}

/**
 * Calcula o Score de Prontidão a partir do histórico de notas do aluno.
 *
 * @param historico Notas (0–100), em ORDEM CRONOLÓGICA (mais antiga → mais recente).
 *                 Só as últimas 5 são consideradas.
 *
 * @example
 *   calcularProntidao([72, 85, 90, 100, 96]);  // → isReady: true (janela cheia + gabaritou)
 *   calcularProntidao([88, 92, 88, 60, 70]);   // → isReady: true (janela cheia + 3 de 5 >= 88%)
 *   calcularProntidao([95, 97, 96]);            // → isReady: false (janela incompleta: só 3 de 5)
 *   calcularProntidao([60, 75, 80]);           // → isReady: false
 */
export function calcularProntidao(
  historico: ReadonlyArray<number | NotaSimulado>,
): ResultadoProntidao {
  // Normaliza para números e pega só a janela dos últimos 5
  const notas = historico
    .map((n) => (typeof n === "number" ? n : n?.pct))
    .filter((n) => typeof n === "number" && Number.isFinite(n))
    .map((n) => Math.min(100, Math.max(0, Math.round(n))));

  const janela = notas.slice(-JANELA_SIMULADOS).reverse(); // mais recente primeiro
  const total = janela.length;
  const melhorNota = total ? Math.max(...janela) : 0;
  const noPadrao = janela.filter((n) => n >= LIMIAR_NOTA).length;

  // A janela precisa estar COMPLETA (5 simulados) para a trava abrir:
  // um único resultado bom não prova consistência.
  const janelaCompleta = total >= JANELA_SIMULADOS;
  const faltamSimulados = Math.max(0, JANELA_SIMULADOS - total);
  const atingiuRegra = melhorNota >= 100 || noPadrao >= ACERTOS_NECESSARIOS;
  const isReady = janelaCompleta && atingiuRegra;

  // Progresso em direção à regra (cada caminho vale até 100%):
  //   A) melhor nota da janela — chega a 100 só se GABARITAR (100%)
  //   B) quantidade de simulados >= 88% — chega a 100 com 3 de 5
  // O maior dos dois caminhos é multiplicado pelo preenchimento da
  // janela (0/5 … 5/5): a barra nunca chega a 100% com janela incompleta.
  const progressoGabarito = melhorNota >= 100 ? 1 : (melhorNota / 100) * 0.85;
  const progressoPadrao = Math.min(noPadrao, ACERTOS_NECESSARIOS) / ACERTOS_NECESSARIOS;
  const progressoFinal =
    (Math.max(progressoGabarito, progressoPadrao) * total) / JANELA_SIMULADOS;
  const readiness = isReady
    ? 100
    : Math.min(99, Math.round(progressoFinal * 100));

  let statusKey: StatusProntidao;
  if (isReady) statusKey = "pronto";
  else if (readiness >= 70) statusKey = "quase-la";
  else statusKey = "em-preparacao";

  const status =
    statusKey === "pronto"
      ? "🚀 Pronto para marcar a prova do Detran!"
      : statusKey === "quase-la"
        ? "Quase lá"
        : "Em preparação";

  const faltam = isReady ? 0 : Math.max(0, ACERTOS_NECESSARIOS - noPadrao);
  const mensagem = montarMensagem({
    isReady,
    faltam,
    faltamSimulados,
    janelaCompleta,
    total,
  });

  return {
    readiness,
    status,
    isReady,
    statusKey,
    janela,
    melhorNota,
    noPadrao,
    faltamSimulados,
    janelaCompleta,
    faltam,
    mensagem,
  };
}

function montarMensagem({
  isReady,
  faltam,
  faltamSimulados,
  janelaCompleta,
  total,
}: {
  isReady: boolean;
  faltam: number;
  faltamSimulados: number;
  janelaCompleta: boolean;
  total: number;
}): string {
  if (isReady) {
    return "Regra cumprida nos últimos 5 simulados. Pode marcar a prova com confiança.";
  }
  if (total === 0) {
    return "Faça seu primeiro simulado para ligar o seu score de prontidão.";
  }
  if (!janelaCompleta) {
    const faltamTxt = `Falta${faltamSimulados > 1 ? "m" : ""} ${faltamSimulados} simulado${
      faltamSimulados > 1 ? "s" : ""
    } para fechar a janela dos últimos 5.`;
    return faltam > 0
      ? `${faltamTxt} Depois disso, ainda são necessários ${faltam} com 88% ou mais.`
      : `${faltamTxt} Assim que ela fechar, a regra já estará cumprida.`;
  }
  return `Faltam ${faltam} simulado${faltam > 1 ? "s" : ""} com 88% ou mais nos últimos 5 para liberar a prova.`;
}

// ------------------------------------------------------------
// PERSISTÊNCIA (localStorage — mesma estratégia do contador de
// simulados concluídos, sem dependência de tabela no banco)
// ------------------------------------------------------------

const KEY_V1 = "nexia:prontidao:v1";
const MAX_REGISTROS = 50; // guarda os últimos 50 para histórico local

function keyFor(userId: string | null | undefined): string {
  return userId ? `${KEY_V1}:${userId}` : KEY_V1;
}

/** Carrega o histórico bruto de notas (ordem cronológica). */
export function carregarHistoricoNotas(
  userId: string | null | undefined,
): NotaSimulado[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n: unknown): n is NotaSimulado =>
        !!n &&
        typeof n === "object" &&
        typeof (n as NotaSimulado).pct === "number",
    );
  } catch {
    return [];
  }
}

/**
 * Registra a nota de um simulado CONCLUÍDO no histórico do aluno.
 * @param pct aproveitamento 0–100 (ex.: Math.round(acertos / total * 100))
 * @returns histórico atualizado (ordem cronológica)
 */
export function registrarNotaSimulado(
  userId: string | null | undefined,
  pct: number,
  modo?: string,
): NotaSimulado[] {
  const historico = carregarHistoricoNotas(userId);
  const nota: NotaSimulado = {
    pct: Math.min(100, Math.max(0, Math.round(pct))),
    em: new Date().toISOString(),
    ...(modo ? { modo } : {}),
  };
  const proximo = [...historico, nota].slice(-MAX_REGISTROS);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(keyFor(userId), JSON.stringify(proximo));
    } catch {
      /* sem localStorage */
    }
  }
  return proximo;
}

/** Calcula o Score de Prontidão direto do histórico salvo do aluno. */
export function prontidaoDoAluno(
  userId: string | null | undefined,
): ResultadoProntidao {
  return calcularProntidao(carregarHistoricoNotas(userId));
}

/** Zera o histórico (uso administrativo/teste). */
export function limparHistoricoProntidao(userId: string | null | undefined): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(keyFor(userId));
  } catch {
    /* sem localStorage */
  }
}
