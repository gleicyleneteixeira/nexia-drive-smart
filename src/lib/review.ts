import { supabase } from "@/integrations/supabase/client";

/**
 * Repetição espaçada por questão (SM-2 simplificado, estilo Anki).
 *
 * Promessa ao aluno: "O app aprende com seus erros e acertos. Questões que
 * você errou aparecem mais; as que você já domina voltam só de vez em quando."
 *
 * Como funciona:
 *   • cada questão tem estado: acertos, erros, sequência (reps), facilidade
 *     (ease), intervalo atual (iv, em dias) e a data da próxima revisão (due);
 *   • ACERTO  -> intervalo cresce (1 d → 3 d → iv × ease), ease sobe 0,05;
 *   • ERRO    -> ease cai 0,2 e a questão volta para revisão em 1 dia;
 *   • o sorteio pondera o peso do estado:
 *       vencida/atrasada ....... ×4   (é a hora dela)
 *       errada há até 3 dias ... ×2,5 (erro recente pesa)
 *       nunca vista ............ ×1,35 (novidade)
 *       dominada (iv >= 14 d)... ×0,25 (descansa, só de vez em quando)
 *
 * Fonte de verdade: localStorage (funciona offline, mesmo padrão do
 * simulados-concluidos). Sincronização opcional com a tabela
 * `question_review` no Supabase: se a tabela não existir, segue só local
 * (mesma degradação silenciosa dos overrides de questões).
 */

export interface ReviewState {
    ok: number; // acertos acumulados
    err: number; // erros acumulados
    reps: number; // acertos seguidos (sequência atual)
    ease: number; // fator de facilidade (1.3 .. 2.8)
    iv: number; // intervalo atual em dias
    due: number; // epoch ms da próxima revisão
    last: number; // epoch ms da última resposta registrada
    lastWrong: number; // epoch ms do último erro (0 = nunca errou)
}

export interface ReviewStats {
    total: number; // questões já registradas
    due: number; // vencidas/agora — devem aparecer no próximo simulado
    wrongRecent: number; // erradas nos últimos 3 dias
    mastered: number; // em revisão longa (intervalo >= 14 dias)
    learned: number; // já acertaram pelo menos 1 vez
}

const KEY = "nexia:review:v1";
const DAY = 86_400_000;
const EASE_INIT = 2.5;
const EASE_MIN = 1.3;
const EASE_MAX = 2.8;
const RECENT_WRONG_MS = 3 * DAY;
const MASTERED_IV = 14;

// Pesos aplicados ao sorteio (ver reviewFactor).
const W_NEW = 1.35;
const W_DUE = 4;
const W_WRONG_RECENT = 2.5;
const W_MASTERED = 0.25;

let cache: Record<string, ReviewState> | null = null;
const dirty = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let serverLoaded = false;

function store(): Record<string, ReviewState> {
    if (cache) return cache;
    if (typeof window === "undefined") {
        cache = {}; // SSR: só memória, nada é gravado
        return cache;
    }
    try {
        const raw = window.localStorage.getItem(KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        cache = parsed && typeof parsed === "object" ? (parsed as Record<string, ReviewState>) : {};
    } catch {
        cache = {};
    }
    return cache;
}

function persist(): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(store()));
    } catch {
        /* sem localStorage (modo privado) */
    }
}

/** Peso da questão no sorteio — é isso que faz "erro recente aparecer mais". */
export function reviewFactor(qid: string, now: number = Date.now()): number {
    const s = store()[qid];
    if (!s) return W_NEW;
    if (s.due <= now) return W_DUE;
    if (s.lastWrong && now - s.lastWrong < RECENT_WRONG_MS) return W_WRONG_RECENT;
    if (s.iv >= MASTERED_IV) return W_MASTERED;
    return 1;
}

/** A questão está vencida (hora de revisar)? */
export function isReviewDue(qid: string, now: number = Date.now()): boolean {
    const s = store()[qid];
    return !!s && s.due <= now;
}

export function getReviewState(qid: string): ReviewState | undefined {
    return store()[qid];
}

/** Registra UMA resposta e recalcula o intervalo da questão (algoritmo SM-2). */
export function registerAnswer(qid: string, correct: boolean): void {
    const map = store();
    const now = Date.now();
    const s: ReviewState = map[qid] ?? {
        ok: 0,
        err: 0,
        reps: 0,
        ease: EASE_INIT,
        iv: 0,
        due: 0,
        last: 0,
        lastWrong: 0,
    };
    if (correct) {
        s.ok += 1;
        s.reps += 1;
        s.iv = s.reps === 1 ? 1 : s.reps === 2 ? 3 : Math.max(1, Math.round(s.iv * s.ease));
        s.ease = Math.min(EASE_MAX, s.ease + 0.05);
        s.due = now + s.iv * DAY;
    } else {
        s.err += 1;
        s.reps = 0;
        s.ease = Math.max(EASE_MIN, s.ease - 0.2);
        s.iv = 1;
        s.due = now + DAY; // volta a ser revisada amanhã
        s.lastWrong = now;
    }
    s.last = now;
    map[qid] = s;
    dirty.add(qid);
    persist();
}

/** Resumo para exibir na tela (feedback visível do que está pendente). */
export function reviewStats(now: number = Date.now()): ReviewStats {
    const map = store();
    const stats: ReviewStats = { total: 0, due: 0, wrongRecent: 0, mastered: 0, learned: 0 };
    for (const s of Object.values(map)) {
        if (!s) continue;
        stats.total += 1;
        if (s.due <= now) stats.due += 1;
        if (s.lastWrong && now - s.lastWrong < RECENT_WRONG_MS) stats.wrongRecent += 1;
        if (s.iv >= MASTERED_IV) stats.mastered += 1;
        if (s.ok > 0) stats.learned += 1;
    }
    return stats;
}

// ---------------------------------------------------------------------------
// Sincronização opcional com o Supabase (tabela question_review)
// ---------------------------------------------------------------------------

function toRow(userId: string, qid: string, s: ReviewState) {
    return {
        user_id: userId,
        question_id: qid,
        ok_count: s.ok,
        err_count: s.err,
        reps: s.reps,
        ease: s.ease,
        interval_days: s.iv,
        due_at: new Date(s.due).toISOString(),
        last_answer_at: new Date(s.last).toISOString(),
        last_wrong_at: s.lastWrong ? new Date(s.lastWrong).toISOString() : null,
    };
}

function fromRow(r: Record<string, unknown>): ReviewState | null {
    if (!r || typeof r.question_id !== "string") return null;
    const due = Date.parse(String(r.due_at ?? ""));
    const last = Date.parse(String(r.last_answer_at ?? ""));
    if (!Number.isFinite(last)) return null;
    const lastWrong = r.last_wrong_at ? Date.parse(String(r.last_wrong_at)) : 0;
    return {
        ok: Number(r.ok_count ?? 0),
        err: Number(r.err_count ?? 0),
        reps: Number(r.reps ?? 0),
        ease: Number(r.ease ?? EASE_INIT),
        iv: Number(r.interval_days ?? 0),
        due: Number.isFinite(due) ? due : last,
        last,
        lastWrong: Number.isFinite(lastWrong) ? lastWrong : 0,
    };
}

/**
 * Baixa o histórico do usuário e mescla com o local (vence o mais recente).
 * Silenciosa: tabela ausente/sem acesso -> mantém só o local.
 */
export async function loadReviewFromServer(userId?: string | null): Promise<void> {
    if (!userId || typeof window === "undefined" || serverLoaded) return;
    try {
        // `as any`: tipos gerados do client ainda não conhecem a tabela
        // (mesmo padrão usado em loadQuestionOverrides).
        const { data, error } = await (supabase as any)
            .from("question_review")
            .select("question_id, ok_count, err_count, reps, ease, interval_days, due_at, last_answer_at, last_wrong_at")
            .eq("user_id", userId);
        if (error || !Array.isArray(data)) return;
        const map = store();
        for (const raw of data as Record<string, unknown>[]) {
            const remote = fromRow(raw);
            if (!remote) continue;
            const qid = String(raw.question_id);
            const local = map[qid];
            if (!local || remote.last > local.last) map[qid] = remote;
        }
        persist();
        serverLoaded = true;
    } catch {
        /* offline/tabela ausente: só local */
    }
}

/** Envia as respostas novas em lote (com debounce — vira 1 chamada por prova). */
export function scheduleReviewSync(userId?: string | null): void {
    if (!userId || typeof window === "undefined") return;
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => {
        flushTimer = null;
        void flushReviewToServer(userId);
    }, 4000);
}

export async function flushReviewToServer(userId: string): Promise<void> {
    if (!userId || dirty.size === 0) return;
    const map = store();
    const rows: ReturnType<typeof toRow>[] = [];
    for (const qid of [...dirty]) {
        const s = map[qid];
        if (s) rows.push(toRow(userId, qid, s));
        dirty.delete(qid);
    }
    if (!rows.length) return;
    try {
        const { error } = await (supabase as any)
            .from("question_review")
            .upsert(rows, { onConflict: "user_id,question_id" });
        if (error) rows.forEach((r) => dirty.add(r.question_id)); // tenta de novo na próxima
    } catch {
        rows.forEach((r) => dirty.add(r.question_id));
    }
}
