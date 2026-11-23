import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Play,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

type TargetSymbol = "up" | "right" | "down" | "left";
type SymbolId =
  | TargetSymbol
  | "up_slash"
  | "right_slash"
  | "diag_up_right"
  | "diag_down_right"
  | "diag_down_left"
  | "diag_up_left"
  | "turn_right"
  | "turn_left"
  | "u_turn";
type Level = 1 | 2 | 3 | 4;
type Phase = "setup" | "example" | "playing" | "level_result" | "final_result";

interface GridCell {
  symbol: SymbolId;
  index: number;
  row: number;
}

interface LevelResult {
  level: Level;
  targetCount: number;
  hits: number;
  errors: number;
  omissions: number;
  omissionAndErrors: number;
  seconds: number;
}

interface HistoryEntry {
  id: string;
  date: string;
  results: LevelResult[];
}

const HISTORY_KEY = "nexia:teaco_seta_history";
const ROWS = 21;
const COLUMNS = 21;
const TARGETS_PER_ROW = 7;
const TIME_OPTIONS = [60, 120, 300];
const TARGETS_BY_LEVEL: Record<Level, TargetSymbol[]> = {
  1: ["up"],
  2: ["up", "right"],
  3: ["up", "right", "down"],
  4: ["up", "right", "down", "left"],
};

const TARGET_LABELS: Record<TargetSymbol, string> = {
  up: "Seta para cima",
  right: "Seta para a direita",
  down: "Seta para baixo",
  left: "Seta para a esquerda",
};

const DISTRACTORS: SymbolId[] = [
  "up_slash",
  "right_slash",
  "diag_up_right",
  "diag_down_right",
  "diag_down_left",
  "diag_up_left",
  "turn_right",
  "turn_left",
  "u_turn",
];

const SYMBOL_PATHS: Record<SymbolId, string> = {
  up: "M16 23V9 M11 14L16 9L21 14",
  right: "M9 16H23 M18 11L23 16L18 21",
  down: "M16 9V23 M11 18L16 23L21 18",
  left: "M23 16H9 M14 11L9 16L14 21",
  up_slash: "M16 23V9 M11 14L16 9L21 14",
  right_slash: "M9 16H23 M18 11L23 16L18 21",
  diag_up_right: "M10 22L22 10 M14 10H22V18",
  diag_down_right: "M10 10L22 22 M14 22H22V14",
  diag_down_left: "M22 10L10 22 M10 14V22H18",
  diag_up_left: "M22 22L10 10 M10 18V10H18",
  turn_right: "M11 24V17C11 12 14 9 19 9H23 M19 5L23 9L19 13",
  turn_left: "M21 24V17C21 12 18 9 13 9H9 M13 5L9 9L13 13",
  u_turn: "M21 24V15C21 10 18 7 14 7H12C8 7 6 10 6 15V24 M2 20L6 24L10 20",
};

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createGrid(targets: TargetSymbol[]): GridCell[] {
  const cells: GridCell[] = [];
  for (let row = 0; row < ROWS; row++) {
    const targetColumns = shuffle(Array.from({ length: COLUMNS }, (_, column) => column)).slice(
      0,
      TARGETS_PER_ROW,
    );
    const targetColumnSet = new Set(targetColumns);

    for (let col = 0; col < COLUMNS; col++) {
      const isTarget = targetColumnSet.has(col);
      cells.push({
        symbol: isTarget ? randomItem(targets) : randomItem(DISTRACTORS),
        index: row * COLUMNS + col,
        row,
      });
    }
  }
  return cells;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function SymbolGraphic({ symbol, size = 28 }: { symbol: SymbolId; size?: number }) {
  const isForbidden = symbol === "up_slash" || symbol === "right_slash";
  const isCurve = symbol === "turn_right" || symbol === "turn_left" || symbol === "u_turn";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="text-rose-600 dark:text-rose-400"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.8" />
      <path
        d={SYMBOL_PATHS[symbol]}
        stroke="currentColor"
        strokeWidth={isCurve ? "2.8" : "2.2"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isForbidden && (
        <path d="M7 25L25 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function AtencaoSetas({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [level, setLevel] = useState<Level>(1);
  const [timeLimit, setTimeLimit] = useState(300);
  const [timeLeft, setTimeLeft] = useState(300);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const [results, setResults] = useState<LevelResult[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const deadlineRef = useRef(0);
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const savedSignatureRef = useRef("");
  const lastMarkedIndexRef = useRef(-1);
  const selectedRef = useRef<Record<number, boolean>>({});

  const targetSymbols = TARGETS_BY_LEVEL[level];
  const rows = useMemo(
    () => Array.from({ length: ROWS }, (_, row) => grid.filter((cell) => cell.row === row)),
    [grid],
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setHistory(parsed as HistoryEntry[]);
      }
    } catch (error) {
      console.error("Não foi possível carregar o histórico do TEACO - SETA.", error);
    }
  }, []);

  const finishLevel = useCallback(
    (finishSession = false) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const targetSet = new Set<TargetSymbol>(targetSymbols);
      const processedTargets = grid.filter(
        (cell) =>
          cell.index <= lastMarkedIndexRef.current && targetSet.has(cell.symbol as TargetSymbol),
      );
      const omissions = processedTargets.filter((cell) => !selectedRef.current[cell.index]).length;
      const seconds = Math.min(
        timeLimit,
        Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)),
      );
      const result: LevelResult = {
        level,
        targetCount: targetSymbols.length,
        hits,
        errors,
        omissions,
        omissionAndErrors: omissions + errors,
        seconds,
      };
      setResults((previous) => [...previous.filter((item) => item.level !== level), result]);
      setPhase(finishSession || level === 4 ? "final_result" : "level_result");
    },
    [currentRow, errors, grid, hits, level, selected, targetSymbols, timeLimit],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) finishLevel();
    }, 250);
    return () => window.clearInterval(timer);
  }, [phase, finishLevel]);

  useEffect(() => {
    if (
      (phase !== "level_result" && phase !== "final_result") ||
      results.length === 0 ||
      !sessionIdRef.current
    ) {
      return;
    }
    const signature = `${sessionIdRef.current}:${JSON.stringify(results)}`;
    if (savedSignatureRef.current === signature) return;
    savedSignatureRef.current = signature;
    const entry: HistoryEntry = {
      id: sessionIdRef.current,
      date: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      results,
    };
    setHistory((previous) => {
      const updated = [entry, ...previous.filter((item) => item.id !== entry.id)].slice(0, 5);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Não foi possível salvar o histórico do TEACO - SETA.", error);
      }
      return updated;
    });
  }, [phase, results]);

  function startLevel(nextLevel: Level) {
    const now = Date.now();
    setLevel(nextLevel);
    setGrid(createGrid(TARGETS_BY_LEVEL[nextLevel]));
    setCurrentRow(0);
    setSelected({});
    selectedRef.current = {};
    lastMarkedIndexRef.current = -1;
    setHits(0);
    setErrors(0);
    setTimeLeft(timeLimit);
    setResults((previous) => previous.filter((item) => item.level < nextLevel));
    startedAtRef.current = now;
    deadlineRef.current = now + timeLimit * 1000;
    finishedRef.current = false;
    if (nextLevel === 1) {
      sessionIdRef.current = `${now}-${Math.random().toString(36).slice(2)}`;
      savedSignatureRef.current = "";
    }
    setPhase("playing");
  }

  function startExample() {
    setLevel(1);
    setGrid(createGrid(TARGETS_BY_LEVEL[1]));
    setCurrentRow(0);
    setSelected({});
    selectedRef.current = {};
    lastMarkedIndexRef.current = -1;
    setHits(0);
    setErrors(0);
    setPhase("example");
  }

  function handleCellClick(cell: GridCell) {
    if ((phase !== "playing" && phase !== "example") || selected[cell.index] !== undefined) {
      return;
    }
    const isTarget = targetSymbols.includes(cell.symbol as TargetSymbol);
    lastMarkedIndexRef.current = Math.max(lastMarkedIndexRef.current, cell.index);
    selectedRef.current = { ...selectedRef.current, [cell.index]: isTarget };
    setSelected(selectedRef.current);
    if (isTarget) setHits((previous) => previous + 1);
    else setErrors((previous) => previous + 1);
  }

  const latestResult = results.find((result) => result.level === level);

  return (
    <div className="space-y-4 pb-8">
      {phase !== "playing" && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs font-medium hover:bg-accent/30"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos testes
        </button>
      )}

      {phase === "setup" && (
        <section className="mx-auto max-w-2xl space-y-5 rounded-3xl glass p-5 shadow-glow md:p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Target className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">TEACO - SETA</p>
            <h2 className="mt-1 text-2xl font-display font-bold">
              Atenção Concentrada — Setas e Símbolos
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A grade oficial tem 21 linhas por 21 símbolos. Marque somente os símbolos exibidos no
              quadro-alvo: cada linha contém exatamente 7 alvos. Cada nível aumenta a quantidade de
              símbolos-alvo exibidos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <p className="text-sm font-bold">Nível {item}</p>
                <p className="text-xs text-muted-foreground">
                  {item} {item === 1 ? "símbolo-alvo" : "símbolos-alvo"} ao mesmo tempo
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Clock3 className="h-4 w-4 text-primary" /> Tempo por nível
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_OPTIONS.map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => setTimeLimit(seconds)}
                  className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${
                    timeLimit === seconds
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border/60 bg-background/40 hover:bg-accent/40"
                  }`}
                >
                  {seconds < 60 ? `${seconds}s` : `${seconds / 60} min`}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            Os acertos contam símbolos-alvo marcados, os erros contam distratores selecionados e as
            omissões são os alvos não marcados até a linha em que você encerrou.
          </div>

          <button
            onClick={startExample}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            <Play className="h-4 w-4" /> Começar TEACO - SETA
          </button>

          {history.length > 0 && (
            <div className="border-t border-border/50 pt-4">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Histórico recente
              </h3>
              <div className="space-y-2">
                {history.map((entry, index) => {
                  const totals = entry.results.reduce(
                    (sum, result) => ({
                      hits: sum.hits + result.hits,
                      errors: sum.errors + result.errors,
                      omissions: sum.omissions + result.omissions,
                    }),
                    { hits: 0, errors: 0, omissions: 0 },
                  );
                  return (
                    <p key={`${entry.date}-${index}`} className="text-xs text-muted-foreground">
                      {entry.date} · {totals.hits} acertos · {totals.errors + totals.omissions} O+E
                      · {entry.results.length}/4 níveis
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {phase === "example" && (
        <section className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Linha de treino — sem contagem de tempo
            </p>
            <h2 className="mt-1 text-xl font-display font-bold">Teste a marcação</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Marque as setas indicadas no quadro abaixo. Os 7 símbolos-alvo estão misturados entre
              14 distratores parecidos.
            </p>
          </div>

          <section className="sticky top-2 z-20 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-card backdrop-blur">
            <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
              Símbolos-alvo desta rodada
            </p>
            <div className="flex justify-center">
              {targetSymbols.map((symbol) => (
                <div
                  key={symbol}
                  className="flex min-w-24 flex-col items-center rounded-xl bg-secondary/40 px-4 py-2"
                >
                  <SymbolGraphic symbol={symbol} size={38} />
                  <span className="mt-1 text-[10px] font-semibold">{TARGET_LABELS[symbol]}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="overflow-x-auto rounded-2xl border border-border/60 bg-secondary/20 p-2">
            <div
              className="grid min-w-[525px] gap-1"
              style={{ gridTemplateColumns: "repeat(21, minmax(22px, 1fr))" }}
            >
              {grid
                .filter((cell) => cell.row === 0)
                .map((cell) => {
                  const wasSelected = selected[cell.index] !== undefined;
                  const isCorrect = selected[cell.index] === true;
                  return (
                    <button
                      key={cell.index}
                      type="button"
                      disabled={wasSelected}
                      onClick={() => handleCellClick(cell)}
                      aria-label={`Símbolo de treino ${cell.index + 1}`}
                      className={`grid aspect-square place-items-center rounded-md border transition-colors ${
                        wasSelected
                          ? isCorrect
                            ? "border-emerald-500/70 bg-emerald-500/15"
                            : "border-destructive/60 bg-destructive/10"
                          : "border-border/50 bg-background/80 hover:border-primary/60 active:scale-95"
                      } disabled:cursor-default`}
                    >
                      <SymbolGraphic symbol={cell.symbol} size={22} />
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-center gap-4 rounded-xl bg-secondary/30 px-3 py-3 text-sm">
              <span className="text-emerald-500">✓ {hits} acertos</span>
              <span className="text-destructive">× {errors} erros</span>
            </div>
            <button
              onClick={() => startLevel(1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              Iniciar contagem oficial <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <>
          <section className="sticky top-2 z-20 space-y-3 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-card backdrop-blur md:p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  TEACO - SETA · Nível {level}/4
                </p>
                <p className="text-xs text-muted-foreground">
                  Procure {targetSymbols.length}{" "}
                  {targetSymbols.length === 1 ? "símbolo-alvo" : "símbolos-alvo"}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-lg font-bold ${
                  timeLeft <= 10 ? "bg-destructive/15 text-destructive" : "bg-secondary/60"
                }`}
                aria-live="polite"
              >
                <Clock3 className="h-4 w-4" />
                {formatDuration(timeLeft)}
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-[width] ${
                  timeLeft <= 10 ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {targetSymbols.map((symbol) => (
                <div
                  key={symbol}
                  className="flex min-w-20 flex-col items-center rounded-xl bg-secondary/40 px-3 py-2"
                >
                  <SymbolGraphic symbol={symbol} size={38} />
                  <span className="mt-1 text-center text-[10px] font-semibold">
                    {TARGET_LABELS[symbol]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-muted-foreground">
              21 linhas × 21 símbolos · {hits} acertos · {errors} erros
            </p>
            <button
              onClick={() => finishLevel(true)}
              className="rounded-lg border border-border/60 px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent/40"
            >
              Encerrar treino
            </button>
          </div>

          <div
            ref={gridRef}
            className="max-h-[60vh] overflow-auto rounded-2xl border border-border/60 bg-secondary/20 p-2"
            aria-label="Grade de busca de símbolos"
          >
            <div className="min-w-[525px] space-y-1">
              {rows.map((rowCells, rowIndex) => {
                return (
                  <div
                    key={rowIndex}
                    data-row={rowIndex}
                    className="grid gap-1 rounded-lg p-0.5"
                    style={{ gridTemplateColumns: "repeat(21, minmax(22px, 1fr))" }}
                  >
                    {rowCells.map((cell) => {
                      const wasSelected = selected[cell.index] !== undefined;
                      const isCorrect = selected[cell.index] === true;
                      return (
                        <button
                          key={cell.index}
                          type="button"
                          disabled={wasSelected}
                          onClick={() => handleCellClick(cell)}
                          aria-label={`Símbolo ${cell.index + 1}: ${
                            TARGET_LABELS[cell.symbol as TargetSymbol] ?? "distrator"
                          }`}
                          className={`grid aspect-square place-items-center rounded-md border transition-colors ${
                            wasSelected
                              ? isCorrect
                                ? "border-emerald-500/70 bg-emerald-500/15"
                                : "border-destructive/60 bg-destructive/10"
                              : "border-border/50 bg-background/80 hover:border-primary/60 hover:bg-primary/5 active:scale-95"
                          } disabled:cursor-default`}
                        >
                          <SymbolGraphic symbol={cell.symbol} size={21} />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => finishLevel(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              Concluir nível <ArrowRight className="h-4 w-4" />
            </button>
            <p className="flex items-center justify-center rounded-xl bg-secondary/30 px-3 py-2 text-center text-[11px] text-muted-foreground">
              Marque os símbolos-alvo em qualquer linha. Os distratores não devem ser marcados.
            </p>
          </div>
        </>
      )}

      {phase === "level_result" && latestResult && (
        <section className="mx-auto max-w-xl space-y-5 rounded-3xl glass p-6 text-center shadow-glow">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Resultado do nível {latestResult.level}
            </p>
            <h2 className="mt-1 text-2xl font-display font-bold">Nível concluído</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {latestResult.targetCount} símbolos-alvo · tempo:{" "}
              {formatDuration(latestResult.seconds)}
            </p>
          </div>
          <ResultMetrics result={latestResult} />
          <button
            onClick={() => startLevel((level + 1) as Level)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Próximo nível <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {phase === "final_result" && (
        <section className="mx-auto max-w-3xl space-y-5 rounded-3xl glass p-5 shadow-glow md:p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">TEACO - SETA</p>
            <h2 className="mt-1 text-2xl font-display font-bold">Resumo do treino</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Resultado separado por nível e consolidado no histórico deste dispositivo.
            </p>
          </div>

          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.level}
                className="rounded-2xl border border-border/60 bg-background/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold">Nível {result.level}</h3>
                  <span className="text-xs text-muted-foreground">
                    {result.targetCount} {result.targetCount === 1 ? "alvo" : "alvos"} ·{" "}
                    {formatDuration(result.seconds)}
                  </span>
                </div>
                <ResultMetrics result={result} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => {
                setResults([]);
                setPhase("setup");
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              <RotateCcw className="h-4 w-4" /> Treinar novamente
            </button>
            <button
              onClick={onBack}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl glass px-5 py-3 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar aos testes
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function ResultMetrics({ result }: { result: LevelResult }) {
  const metrics = [
    { label: "Acertos", value: result.hits, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Erros", value: result.errors, icon: XCircle, color: "text-destructive" },
    { label: "Omissões", value: result.omissions, icon: Target, color: "text-amber-500" },
    { label: "O+E", value: result.omissionAndErrors, icon: XCircle, color: "text-foreground" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {metrics.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="rounded-xl bg-secondary/40 p-3 text-center">
          <Icon className={`mx-auto h-4 w-4 ${color}`} />
          <p className="mt-1 text-xl font-bold">{value}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
