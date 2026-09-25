// Contador de simulados FINALIZADOS (teórico, qualquer categoria/modo).
// Só conta ao concluir (última questão ou "finalizar" confirmado) — abandonar
// no meio não conta. Guarda por usuário no navegador (localStorage).
// Sem tabela no banco para isso; mesma estratégia do progresso do cronograma.

export interface SimuladosStats {
  total: number; // finalizados (concluídos)
  iniciados: number; // iniciados (para derivar interrompidos = iniciados - total)
  porModo: Record<string, number>;
  lastAt: string | null;
}

const keyFor = (userId: string) => `nexia:simulados_concluidos:${userId}`;

const VAZIO: SimuladosStats = { total: 0, iniciados: 0, porModo: {}, lastAt: null };

export function lerSimuladosConcluidos(userId: string | null | undefined): SimuladosStats {
  if (!userId || typeof window === "undefined") return VAZIO;
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return VAZIO;
    const p = JSON.parse(raw);
    return {
      total: typeof p.total === "number" ? p.total : 0,
      iniciados: typeof p.iniciados === "number" ? p.iniciados : 0,
      porModo: p.porModo && typeof p.porModo === "object" ? p.porModo : {},
      lastAt: typeof p.lastAt === "string" ? p.lastAt : null,
    };
  } catch {
    return VAZIO;
  }
}

/** Marca 1 simulado INICIADO (novo, não retomada). Interrompidos = iniciados - total. */
export function registrarSimuladoIniciado(userId: string | null | undefined): void {
  if (!userId || typeof window === "undefined") return;
  const atual = lerSimuladosConcluidos(userId);
  try {
    localStorage.setItem(
      keyFor(userId),
      JSON.stringify({ ...atual, iniciados: atual.iniciados + 1 })
    );
  } catch {
    /* sem localStorage */
  }
}

const MARCOS = [1, 10, 25, 50, 100, 250, 500, 1000];

export function registrarSimuladoConcluido(
  userId: string | null | undefined,
  modo: string
): { total: number; marco: number | null } {
  if (!userId || typeof window === "undefined") return { total: 0, marco: null };
  const atual = lerSimuladosConcluidos(userId);
  const total = atual.total + 1;
  const next: SimuladosStats = {
    total,
    iniciados: Math.max(atual.iniciados, total),
    porModo: { ...atual.porModo, [modo]: (atual.porModo[modo] ?? 0) + 1 },
    lastAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(next));
  } catch {
    /* sem localStorage */
  }
  return { total, marco: MARCOS.includes(total) ? total : null };
}
