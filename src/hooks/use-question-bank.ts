import { useCallback, useSyncExternalStore } from "react";
import { getQuestionBank, subscribeQuestionBank } from "@/data/questions";
import type { Question } from "@/data/questions";

/**
 * Banco de questões reativo: atualiza na hora quando o admin desabilita,
 * edita ou cria uma questão (notificação via subscribeQuestionBank).
 * @param includeDisabled lista também as desabilitadas — só o admin usa.
 */
export function useQuestionBank(includeDisabled = false): Question[] {
    // Identidade estável exigida pelo useSyncExternalStore (muda só quando
    // o parâmetro muda); o snapshot em si já é cacheado em getQuestionBank.
    const getSnapshot = useCallback(
        () => getQuestionBank({ includeDisabled }),
        [includeDisabled],
    );
    // Snapshot do servidor = mesmo cálculo (estado de módulo ainda vazio
    // durante a hidratação, igual ao cliente no primeiro render).
    return useSyncExternalStore(subscribeQuestionBank, getSnapshot, getSnapshot);
}
