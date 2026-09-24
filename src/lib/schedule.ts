/**
 * Fonte única de verdade do cronograma de estudos.
 *
 * Regra de negócio (UX educacional):
 *  - `completed_pages` é monotônico (nunca retrocede) e é a ÚNICA entrada de progresso.
 *  - O cronograma é uma PROJEÇÃO PURA: f(progresso, hoje, dias, ritmo, prova).
 *    Não é "arquivo": pode ser regerado a qualquer momento sem perda de estado.
 *  - Sem datas passadas pendentes: o saldo de uma leitura parcial é reagendado
 *    para o próximo dia de estudo (nunca trava na data de hoje).
 *  - Adiantamento ENCOLHE o cronograma (recompensa: menos blocos, data final antes).
 *  - Atraso ESTICA o ritmo proporcionalmente até o limite antes da prova
 *    (recuperação gradual, sem punição abrupta). Acima do limite → estado RISCO.
 */

export const START_PAGE = 17;
export const END_PAGE = 104;
export const TOTAL_THEORETICAL_PAGES = 88;

/** Dias de folga exigidos entre o fim da leitura e a data da prova. */
export const BUFFER_PROVA_DIAS = 2;

export const DAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export const BOOK_CHAPTERS = [
  { id: 1, title: "Capítulo 1 - Legislação de Trânsito", startPage: 17, endPage: 44, totalPages: 28 },
  { id: 2, title: "Capítulo 2 - Direção Defensiva", startPage: 45, endPage: 71, totalPages: 27 },
  { id: 3, title: "Capítulo 3 - Noções de Primeiros Socorros", startPage: 72, endPage: 78, totalPages: 7 },
  { id: 4, title: "Capítulo 4 - Meio Ambiente e Convívio Social", startPage: 79, endPage: 95, totalPages: 17 },
  { id: 5, title: "Capítulo 5 - Funcionamento do Veículo (Mecânica)", startPage: 96, endPage: 104, totalPages: 9 },
];

export interface ScheduleItem {
  dia: number;
  /** ISO (yyyy-mm-dd). Vazio ("") para blocos já concluídos (histórico sem data). */
  data: string;
  capitulo: string;
  capituloId: number;
  paginaInicio: number;
  paginaFim: number;
  concluido: boolean;
}

export interface GerarCronogramaInput {
  /** completed_pages — última página lida (0 = nada lido). */
  progresso: number;
  /** Dias da semana selecionados ("Segunda-feira", ...). */
  selectedDays: string[];
  /** Ritmo planejado (páginas por dia de estudo). */
  blockPages: number;
  /** Data da prova (ISO) ou null (sem prova marcada). */
  examDate: string | null;
  /** true se houve leitura registrada hoje (last_access_date == hoje). */
  leuHoje: boolean;
  /** Override de teste. */
  hoje?: Date;
}

export interface CronogramaGerado {
  blocos: ScheduleItem[];
  /** Ritmo efetivo usado (pode ser maior que o planejado no cenário APERTADO). */
  blocoUsado: number;
  /** true se o ritmo precisou ser esticado para caber antes da prova. */
  ajustado: boolean;
  /** true se nem no ritmo máximo cabe antes da prova (requer ajuste manual). */
  risco: boolean;
  /** Data do último bloco pendente (null se cronograma concluído). */
  dataFinal: string | null;
}

export type TipoResultadoLeitura =
  | "CRONOGRAMA_CONCLUIDO"
  | "ADIANTADO"
  | "REAGENDADO"
  | "OK";

/** Data local em ISO (yyyy-mm-dd) sem depender de fuso UTC. */
export function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function capituloDaPagina(pag: number): { titulo: string; id: number } {
  const c = BOOK_CHAPTERS.find((ch) => pag >= ch.startPage && pag <= ch.endPage);
  return c ? { titulo: c.title, id: c.id } : { titulo: "Livro do Detran", id: 0 };
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** Quantidade de dias selecionados entre `from` e `to` (inclusivos). */
function contarDiasUteis(from: Date, to: Date | null, selectedDays: string[]): number {
  if (selectedDays.length === 0) return 0;
  let count = 0;
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  let guard = 0;
  while (guard < 1000) {
    guard++;
    if (to && d > to) break;
    if (selectedDays.includes(DAY_NAMES[d.getDay()])) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

/**
 * Gera o cronograma completo projetado a partir do progresso atual.
 *
 * Camada 1 (concluída): páginas START..progresso particionadas no ritmo —
 *   histórico sem data (inclui automaticamente tarefas "adiantadas").
 * Camada 2 (pendente): páginas progresso+1..END datadas nos dias selecionados,
 *   começando em HOJE (se ainda não leu hoje) ou no PRÓXIMO dia de estudo
 *   (se já leu hoje — saldo parcial NÃO trava na data de hoje).
 */
export function gerarCronograma(input: GerarCronogramaInput): CronogramaGerado {
  const hoje = input.hoje ? new Date(input.hoje) : new Date();
  hoje.setHours(0, 0, 0, 0);

  const blockPages = Math.max(1, Math.floor(input.blockPages || 1));
  const progresso = clamp(Math.floor(input.progresso || 0), 0, END_PAGE);
  const selectedDays = input.selectedDays ?? [];

  const blocos: ScheduleItem[] = [];
  let diaNum = 1;

  // ── Camada 1: blocos concluídos (histórico, sem data) ──────────────
  let p = START_PAGE;
  while (p <= progresso && p <= END_PAGE) {
    const fim = Math.min(p + blockPages - 1, progresso);
    const cap = capituloDaPagina(p);
    blocos.push({
      dia: diaNum,
      data: "",
      capitulo: cap.titulo,
      capituloId: cap.id,
      paginaInicio: p,
      paginaFim: fim,
      concluido: true,
    });
    p = fim + 1;
    diaNum++;
  }

  if (p > END_PAGE) {
    return {
      blocos,
      blocoUsado: blockPages,
      ajustado: false,
      risco: false,
      dataFinal: null,
    };
  }

  // ── Restrição de prazo (prova) ─────────────────────────────────────
  let bloco = blockPages;
  let ajustado = false;
  let risco = false;
  let limite: Date | null = null;

  if (input.examDate) {
    limite = new Date(input.examDate + "T00:00:00");
    limite.setHours(0, 0, 0, 0);
    limite = addDays(limite, -BUFFER_PROVA_DIAS);

    const necessarias = END_PAGE - p + 1;
    const diasUteis = contarDiasUteis(hoje, limite, selectedDays);

    if (diasUteis === 0) {
      // Nenhum dia de estudo restante antes da prova → sempre risco.
      risco = true;
    } else if (necessarias > diasUteis * bloco) {
      // ATRASO: estica o ritmo proporcionalmente, com teto de saúde.
      const exigido = Math.ceil(necessarias / diasUteis);
      const maxBloco = Math.max(bloco, Math.min(bloco * 2, 30));
      if (exigido <= maxBloco) {
        bloco = exigido;
        ajustado = true;
      } else {
        bloco = maxBloco;
        risco = true;
      }
    }
    // ADIANTADO: `bloco` permanece igual → menos blocos → termina antes da prova.
  }

  // ── Data inicial dos pendentes ─────────────────────────────────────
  // Regra estável: se já houve leitura hoje, o saldo é reagendado para o
  // PRÓXIMO dia de estudo; caso contrário, o dia de hoje ainda está disponível.
  const d = new Date(hoje);
  const hojeEhDiaDeEstudo = selectedDays.includes(DAY_NAMES[d.getDay()]);
  if (input.leuHoje && hojeEhDiaDeEstudo) {
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
  }

  // ── Camada 2: blocos pendentes datados ─────────────────────────────
  let guard = 0;
  while (p <= END_PAGE && guard < 500) {
    guard++;
    if (selectedDays.includes(DAY_NAMES[d.getDay()])) {
      if (limite && d > limite) risco = true;
      const fim = Math.min(p + bloco - 1, END_PAGE);
      const cap = capituloDaPagina(p);
      blocos.push({
        dia: diaNum,
        data: isoLocal(d),
        capitulo: cap.titulo,
        capituloId: cap.id,
        paginaInicio: p,
        paginaFim: fim,
        concluido: false,
      });
      p = fim + 1;
      diaNum++;
    }
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
  }

  const pendentes = blocos.filter((b) => !b.concluido);
  return {
    blocos,
    blocoUsado: bloco,
    ajustado,
    risco,
    dataFinal: pendentes.length > 0 ? pendentes[pendentes.length - 1].data : null,
  };
}

/** Diferença em dias (positiva = o novo plano termina ANTES do anterior). */
export function diffDias(isoAntes: string | null, isoDepois: string | null): number {
  if (!isoAntes || !isoDepois) return 0;
  const a = new Date(isoAntes + "T00:00:00").getTime();
  const b = new Date(isoDepois + "T00:00:00").getTime();
  return Math.round((a - b) / (24 * 60 * 60 * 1000));
}

/**
 * Classifica o resultado de um informe de leitura para feedback de UX.
 * Chamado ANTES de substituir o cronograma antigo pelo novo.
 */
export function classificarLeitura(opts: {
  informado: number;
  fimMetaAnterior: number;
  dataFinalAntes: string | null;
  dataFinalDepois: string | null;
}): { tipo: TipoResultadoLeitura; diasGanhos: number } {
  const diasGanhos = diffDias(opts.dataFinalAntes, opts.dataFinalDepois);

  if (opts.informado >= END_PAGE) {
    return { tipo: "CRONOGRAMA_CONCLUIDO", diasGanhos };
  }
  if (diasGanhos > 0) {
    return { tipo: "ADIANTADO", diasGanhos };
  }
  if (opts.informado < opts.fimMetaAnterior) {
    return { tipo: "REAGENDADO", diasGanhos };
  }
  return { tipo: "OK", diasGanhos };
}

/** Primeira página pendente (null se concluído). */
export function primeiraPendente(blocos: ScheduleItem[]): ScheduleItem | null {
  return blocos.find((b) => !b.concluido) ?? null;
}
