// ============================================================
// SCORE DE PRONTIDÃO — Simulado Nexia Drive
// ------------------------------------------------------------
// REGRA DE NEGÓCIO (exata):
//   • Conta APENAS simulado GERAL ("completo", "prova-real" ou
//     registro antigo sem modo). Simulado por categoria NÃO conta.
//   • A contagem ZERA TODO DIA (fuso local do aluno): só os
//     simulados gerais feitos HOJE entram no cálculo — fez ontem
//     e faz hoje, a contagem recomeça na de hoje.
//   • Dentro do dia, os simulados gerais formam BLOCOS DE 5:
//       → 1º do bloco: score 0 (começa uma nova contagem);
//       → 2º ao 4º: o score sobe gradualmente (qualidade × avanço);
//       → 5º: RESULTADO DO BLOCO — aluno está PRONTO se:
//           a) GABARITAR (100%) em qualquer um desses 5, OU
//           b) acertar no mínimo 88% em pelo menos 3 dos 5.
//       → 6º: zera de novo e inicia o próximo bloco (1/5) —
//         o mesmo se repete no 10º, 15º … (fechamento de bloco).
//
// SAÍDA:
//   • readiness: 0–100 (só chega a 100 ao fechar bloco com regra)
//   • status: texto ("Em preparação" | "Quase lá" | "🚀 Pronto…")
//   • isReady: trava booleana (true apenas ao fechar bloco com regra)
//   • statusKey: classificação estruturada (para estilizar)
//   • bloco: notas do bloco em curso (do dia), mais recente primeiro
//   • melhorNota / noPadrao: apurados sobre o bloco em curso
//   • faltamSimulados: quanto falta para fechar o bloco de 5
//   • blocoCompleto: true ao 5º simulado do bloco (momento da avaliação)
//   • faltam: quanto falta da regra "3 de 5 a 88%+"
//   • mensagem: linha de apoio explicando o próximo passo
// ============================================================

export const JANELA_SIMULADOS = 5; // tamanho do bloco diário de simulados gerais
export const LIMIAR_NOTA = 88; // mínimo de aproveitamento por simulado
export const ACERTOS_NECESSARIOS = 3; // de 5 precisam chegar a 88%

export type StatusProntidao = "em-preparacao" | "quase-la" | "pronto";

/** Registro bruto de um simulado concluído. */
export interface NotaSimulado {
  pct: number; // aproveitamento 0–100
  em: string; // ISO date
  modo?: string; // "completo" | "prova-real" | categoria (categoria não conta)
}

export interface ResultadoProntidao {
  /** Percentual de prontidão (0–100). Igual a 100 ⟺ isReady === true. */
  readiness: number;
  /** Texto do status para exibir ao aluno. */
  status: string;
  /** Trava: true quando a regra foi batida ao fechar um bloco de 5. */
  isReady: boolean;
  /** Classificação estruturada (útil para estilizar/tomar decisão). */
  statusKey: StatusProntidao;
  /** Notas do bloco em curso, mais recente primeiro (0–5). */
  bloco: number[];
  /** Melhor nota do bloco em curso (0 quando não há histórico hoje). */
  melhorNota: number;
  /** Quantos simulados do bloco em curso chegaram a >= 88%. */
  noPadrao: number;
  /** Quantos simulados ainda faltam para fechar o bloco de 5. */
  faltamSimulados: number;
  /** true quando o 5º do bloco foi concluído (avaliação da regra). */
  blocoCompleto: boolean;
  /** Quanto falta da regra "3 de 5 a 88%+" (0 quando cumprida). */
  faltam: number;
  /** Linha de apoio explicando o próximo passo. */
  mensagem: string;
}

/** Só simulado GERAL conta no score — modo de categoria não conta. */
function ehModoGeral(modo?: string): boolean {
  return !modo || modo === "completo" || modo === "prova-real";
}

/** true se a nota foi registrada no dia corrente (fuso local do aluno). */
function ehHoje(iso?: string): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const agora = new Date();
  return (
    d.getFullYear() === agora.getFullYear() &&
    d.getMonth() === agora.getMonth() &&
    d.getDate() === agora.getDate()
  );
}

/**
 * Calcula o Score de Prontidão a partir do histórico do aluno.
 *
 * As regras de contagem são aplicadas AQUI (em todo call site):
 *   1) só simulado geral (categoria é ignorada);
 *   2) só notas de HOJE (a contagem zera todo dia);
 *   3) as notas do dia vêm em blocos de 5 — o 6º do dia zera e
 *      começa nova contagem; o 5º de cada bloco mostra o resultado.
 *
 * @param historico Notas (0–100), em ORDEM CRONOLÓGICA (mais antiga → mais recente).
 *                  Entradas numéricas puras (API legada/testes) entram sem
 *                  metadados de data/modo e são aceitas como estão.
 *
 * @example
 *   calcularProntidao([72, 85, 90, 100, 96]);  // 5º do bloco + gabaritou → isReady: true
 *   calcularProntidao([88, 92, 88, 60, 70]);   // 5º do bloco + 3 de 5 >= 88% → isReady: true
 *   calcularProntidao([95, 97, 96]);           // bloco incompleto (3 de 5) → isReady: false
 *   calcularProntidao([100]);                  // 1º do bloco → readiness: 0 (nova contagem)
 */
export function calcularProntidao(
  historico: ReadonlyArray<number | NotaSimulado>,
): ResultadoProntidao {
  // 1) Filtro de contagem: só simulado geral feito HOJE.
  const notasDoDia: number[] = [];
  for (const n of historico) {
    if (typeof n === "number") {
      if (Number.isFinite(n)) notasDoDia.push(n);
      continue;
    }
    if (!n || typeof n.pct !== "number" || !Number.isFinite(n.pct)) continue;
    if (!ehModoGeral(n.modo)) continue; // por categoria não conta
    if (!ehHoje(n.em)) continue; // zera todo dia
    notasDoDia.push(n.pct);
  }
  const notas = notasDoDia.map((n) => Math.min(100, Math.max(0, Math.round(n))));

  // 2) Bloco em curso do dia: o 6º zera (posição 1 do novo bloco).
  const noDia = notas.length;
  const posicao = noDia === 0 ? 0 : ((noDia - 1) % JANELA_SIMULADOS) + 1; // 1..5
  const bloco = noDia === 0 ? [] : notas.slice(noDia - posicao); // cronológico
  const janela = [...bloco].reverse(); // mais recente primeiro

  const total = posicao; // notas do bloco em curso (0..5)
  const melhorNota = total ? Math.max(...bloco) : 0;
  const noPadrao = bloco.filter((n) => n >= LIMIAR_NOTA).length;

  // O bloco só é AVALIADO no 5º simulado — antes disso a trava não abre.
  const blocoCompleto = total >= JANELA_SIMULADOS;
  const faltamSimulados = Math.max(0, JANELA_SIMULADOS - total);
  const atingiuRegra = melhorNota >= 100 || noPadrao >= ACERTOS_NECESSARIOS;
  const isReady = blocoCompleto && atingiuRegra;

  // Progresso em direção à regra (cada caminho vale até 100%):
  //   A) melhor nota do bloco — chega a 100 só se GABARITAR (100%)
  //   B) quantidade de simulados >= 88% — chega a 100 com 3 de 5
  // Enquanto o bloco não fecha, o avanço é proporcional à posição
  // (0 no 1º, 25% no 2º … 75% no 4º); no 5º vale o resultado real.
  const progressoGabarito = melhorNota >= 100 ? 1 : (melhorNota / 100) * 0.85;
  const progressoPadrao = Math.min(noPadrao, ACERTOS_NECESSARIOS) / ACERTOS_NECESSARIOS;
  const qualidade = Math.max(progressoGabarito, progressoPadrao);

  let readiness: number;
  if (isReady) {
    readiness = 100;
  } else if (total >= JANELA_SIMULADOS) {
    // bloco fechou sem a regra: mostra o quão perto o aluno chegou
    readiness = Math.min(99, Math.round(qualidade * 100));
  } else if (total <= 1) {
    readiness = 0; // nova contagem (1º do dia ou 6º do dia)
  } else {
    readiness = Math.min(
      99,
      Math.round((qualidade * (total - 1)) / (JANELA_SIMULADOS - 1) * 100),
    );
  }

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
    blocoCompleto,
    total,
    noPadrao,
  });

  return {
    readiness,
    status,
    isReady,
    statusKey,
    bloco: janela,
    melhorNota,
    noPadrao,
    faltamSimulados,
    blocoCompleto,
    faltam,
    mensagem,
  };
}

function montarMensagem({
  isReady,
  faltam,
  faltamSimulados,
  blocoCompleto,
  total,
  noPadrao,
}: {
  isReady: boolean;
  faltam: number;
  faltamSimulados: number;
  blocoCompleto: boolean;
  total: number;
  noPadrao: number;
}): string {
  if (isReady) {
    return "Bloco de 5 concluído com a regra — pode marcar a prova com confiança.";
  }
  if (total === 0) {
    return "Faça um simulado GERAL hoje para ligar o score: a contagem é em blocos de 5 e zera todo dia.";
  }
  if (total === 1) {
    return "Nova contagem iniciada: 1 de 5 simulados gerais de hoje. O resultado aparece ao completar o bloco.";
  }
  if (!blocoCompleto) {
    const faltamTxt = `Falta${faltamSimulados > 1 ? "m" : ""} ${faltamSimulados} simulado${
      faltamSimulados > 1 ? "s" : ""
    } geral${faltamSimulados > 1 ? "eis" : ""} para fechar o bloco de hoje.`;
    if (faltam === 0) {
      return `${faltamTxt} Regra dos ${LIMIAR_NOTA}%+ já garantida (${noPadrao} de ${JANELA_SIMULADOS}).`;
    }
    return `${faltamTxt} ${noPadrao} de ${JANELA_SIMULADOS} já a ${LIMIAR_NOTA}%+ (precisa de ${ACERTOS_NECESSARIOS}).`;
  }
  return `Bloco fechado sem a regra: ${noPadrao} de ${JANELA_SIMULADOS} a ${LIMIAR_NOTA}%+ (precisa de ${ACERTOS_NECESSARIOS}) e nenhum gabarito. O próximo simulado geral inicia um novo bloco.`;
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
 * Registra a nota de um simulado GERAL concluído no histórico do aluno.
 * Simulados por categoria são ignorados (não contam no score).
 * @param pct aproveitamento 0–100 (ex.: Math.round(acertos / total * 100))
 * @returns histórico atualizado (ordem cronológica)
 */
export function registrarNotaSimulado(
  userId: string | null | undefined,
  pct: number,
  modo?: string,
): NotaSimulado[] {
  const historico = carregarHistoricoNotas(userId);
  if (!ehModoGeral(modo)) return historico; // por categoria não conta
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

/**
 * Calcula o Score de Prontidão direto do histórico salvo do aluno
 * (aplica as regras de contagem: só geral + só hoje + blocos de 5).
 */
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
