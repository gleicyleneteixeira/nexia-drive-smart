import { createFileRoute, Link } from "@tanstack/react-router";
import { triggerRatingPrompt } from "@/components/RatingPrompt";
import { useEffect, useRef, useState, useCallback, useMemo, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchLibraryItems } from "@/lib/library";
import {
  Brain,
  Eye,
  Timer,
  Shapes,
  ArrowRight,
  RotateCcw,
  Trophy,
  ArrowLeft,
  Volume2,
  VolumeX,
  Check,
  X,
  Play,
  Pause,
} from "lucide-react";
import memoriaImg from "@/assets/psico-memoria.png";
import { isValidAnswer } from "@/utils/textMatcher";
import { COMPLETE_MEMORY_ELEMENTS } from "@/data/psicotecnico";

export const Route = createFileRoute("/psicotecnico")({
  validateSearch: (search: Record<string, unknown>): { test?: string } => {
    const test = typeof search.test === "string" ? search.test : undefined;
    return { test };
  },
  component: PsicoPage,
  head: () => ({
    meta: [
      { title: "Simulador Psicotécnico DETRAN — Nexia" },
      {
        name: "description",
        content:
          "Treine os 4 testes do exame psicotécnico do DETRAN: palográfico (risquinhos), atenção, memória rápida e raciocínio lógico.",
      },
    ],
  }),
});

type Stage = "hub" | "atencao" | "memoria" | "logico" | "result";

interface ScoreMap {
  atencao?: { correct: number; total: number };
  memoria?: { items: number };
  logico?: { correct: number; total: number };
}

// ===================== Speech (audio explicativo) =====================
function useSpeech() {
  const [enabled, setEnabled] = useState(true);
  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined") return;
      try {
        window.speechSynthesis.cancel();
        if (!enabled) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "pt-BR";
        u.rate = 1.03;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
      } catch {}
    },
    [enabled],
  );
  const stop = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }, []);
  return { enabled, setEnabled, speak, stop };
}

// ===================== HUB =====================
function PsicoPage() {
  const { test } = Route.useSearch();
  const initialStage: Stage =
    test === "atencao" || test === "memoria" || test === "logico" ? test : "hub";
  const [stage, setStage] = useState<Stage>(initialStage);
  const [scores, setScores] = useState<ScoreMap>({});
  const speech = useSpeech();

  useEffect(() => () => speech.stop(), [speech]);

  function go(next: Stage) {
    speech.stop();
    setStage(next);
  }

  // Dispara pedido de avaliação 2s após terminar a avaliação psicotécnica completa
  useEffect(() => {
    if (stage === "result") {
      const t = setTimeout(() => triggerRatingPrompt("simulado-done"), 2000);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div>
          {stage !== "hub" && (
            <button
              onClick={() => go("hub")}
              className="inline-flex items-center gap-2 px-3 py-2 mb-3 rounded-lg glass text-xs font-medium hover:bg-accent/30 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          )}
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4" /> Psicotécnico
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">
            Simulador <span className="gradient-text">Psicotécnico</span> DETRAN
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Os 4 testes oficiais. Treine antes do dia da avaliação.
          </p>
        </div>
        <button
          onClick={() => speech.setEnabled((v) => !v)}
          className="px-3 py-2 rounded-xl glass text-xs flex items-center gap-2"
        >
          {speech.enabled ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
          {speech.enabled ? "Áudio ligado" : "Áudio mudo"}
        </button>
      </div>

      {stage === "hub" && (
        <Hub
          onPick={(s) => {
            go(s);
          }}
          scores={scores}
          speech={speech}
        />
      )}

      {stage === "atencao" && (
        <Atencao
          speech={speech}
          onDone={(r) => {
            setScores((s) => ({ ...s, atencao: r }));
            go("memoria");
          }}
        />
      )}
      {stage === "memoria" && (
        <Memoria
          speech={speech}
          onDone={(r) => {
            setScores((s) => ({ ...s, memoria: r }));
            go("logico");
          }}
        />
      )}
      {stage === "logico" && (
        <Logico
          speech={speech}
          onDone={(r) => {
            setScores((s) => ({ ...s, logico: r }));
            go("result");
          }}
        />
      )}
      {stage === "result" && (
        <Result
          scores={scores}
          onRestart={() => {
            setScores({});
            go("hub");
          }}
        />
      )}
    </div>
  );
}

// ===================== HUB CARDS =====================
const TESTS: {
  id: Stage;
  title: string;
  desc: string;
  icon: typeof Brain;
  accent: string;
}[] = [
  {
    id: "atencao",
    title: "Teste de Atenção",
    desc: "Siga a linha certa e marque a figura igual.",
    icon: Eye,
    accent: "from-warning to-destructive",
  },
  {
    id: "memoria",
    title: "Memória Rápida",
    desc: "Memorize a cena e liste o máximo de objetos.",
    icon: Timer,
    accent: "from-destructive to-warning",
  },
  {
    id: "logico",
    title: "Raciocínio Lógico",
    desc: "Figuras geométricas — encontre o padrão.",
    icon: Shapes,
    accent: "from-primary-glow to-primary",
  },
];

function Hub({
  onPick,
  speech,
}: {
  onPick: (s: Stage) => void;
  scores: ScoreMap;
  speech: ReturnType<typeof useSpeech>;
}) {
  useEffect(() => {
    speech.speak(
      "Bem-vindo ao simulador psicotécnico do DETRAN. Você fará três testes: atenção, memória rápida e raciocínio lógico. Toque em começar para iniciar.",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6 shadow-card">
        <p className="text-sm text-muted-foreground">
          A avaliação completa leva cerca de <strong>6 minutos</strong>. Antes de cada teste, um
          áudio explica o que fazer. Vamos juntos.
        </p>
        <button
          onClick={() => onPick("atencao")}
          className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
        >
          <Play className="h-4 w-4" /> Começar do início
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TESTS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              className="text-left glass rounded-2xl p-5 hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center mb-3 shadow-card`}
              >
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
            </button>
          );
        })}
      </div>
      <Link
        to="/"
        className="block text-center text-xs text-muted-foreground hover:text-foreground"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}

// ===================== TEST 2: ATENÇÃO CONCENTRADA =====================

type SymbolId =
  | "circle_empty"
  | "circle_filled"
  | "star_5"
  | "star_6"
  | "square_empty"
  | "square_dot"
  | "triangle_up"
  | "triangle_down"
  | "diamond_empty"
  | "diamond_line"
  | "arrow_right"
  | "arrow_tilted";

interface GameSymbol {
  id: SymbolId;
  pairId: SymbolId;
  render: (size?: number) => React.ReactNode;
}

const SYMBOL_REGISTRY: Record<SymbolId, GameSymbol> = {
  circle_empty: {
    id: "circle_empty",
    pairId: "circle_filled",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  circle_filled: {
    id: "circle_filled",
    pairId: "circle_empty",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <circle cx="12" cy="12" r="8" fill="currentColor" />
      </svg>
    ),
  },
  star_5: {
    id: "star_5",
    pairId: "star_6",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <polygon
          points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  star_6: {
    id: "star_6",
    pairId: "star_5",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <polygon
          points="12,3 15,9 21,9 18,14 20,20 12,16 4,20 6,14 3,9 9,9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="12,21 15,15 21,15 18,10 20,4 12,8 4,4 6,10 3,15 9,15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0.3"
        />
      </svg>
    ),
  },
  square_empty: {
    id: "square_empty",
    pairId: "square_dot",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
    ),
  },
  square_dot: {
    id: "square_dot",
    pairId: "square_empty",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  triangle_up: {
    id: "triangle_up",
    pairId: "triangle_down",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <polygon
          points="12,4 4,20 20,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  triangle_down: {
    id: "triangle_down",
    pairId: "triangle_up",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <polygon
          points="12,20 4,4 20,4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  diamond_empty: {
    id: "diamond_empty",
    pairId: "diamond_line",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <polygon
          points="12,3 21,12 12,21 3,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  diamond_line: {
    id: "diamond_line",
    pairId: "diamond_empty",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <polygon
          points="12,3 21,12 12,21 3,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  arrow_right: {
    id: "arrow_right",
    pairId: "arrow_tilted",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
      >
        <path
          d="M4 12h16M13 5l7 7-7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  arrow_tilted: {
    id: "arrow_tilted",
    pairId: "arrow_right",
    render: (size = 24) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="text-zinc-400 dark:text-zinc-100"
        style={{ transform: "rotate(-30deg)" }}
      >
        <path
          d="M4 12h16M13 5l7 7-7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

// Web Audio API Synthesizer
class SoundSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {}
    }
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.playTone(523.25, 0.1, 0.04, now);
      this.playTone(659.25, 0.12, 0.04, now + 0.08);
    } catch {}
  }

  playFailure() {
    this.init();
    if (!this.ctx) return;
    try {
      this.playTone(130, 0.25, 0.06, this.ctx.currentTime, "sawtooth");
    } catch {}
  }

  playCountdownTick() {
    this.init();
    if (!this.ctx) return;
    try {
      this.playTone(850, 0.05, 0.02, this.ctx.currentTime);
    } catch {}
  }

  playCountdownStart() {
    this.init();
    if (!this.ctx) return;
    try {
      this.playTone(1050, 0.3, 0.04, this.ctx.currentTime);
    } catch {}
  }

  playWarningBeep() {
    this.init();
    if (!this.ctx) return;
    try {
      this.playTone(600, 0.12, 0.03, this.ctx.currentTime);
    } catch {}
  }

  playTargetChange() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.playTone(400, 0.12, 0.03, now, "sine");
      this.playTone(600, 0.12, 0.03, now + 0.08, "sine");
      this.playTone(800, 0.18, 0.03, now + 0.16, "sine");
    } catch {}
  }

  private playTone(
    freq: number,
    duration: number,
    volume: number,
    startTime: number,
    type: OscillatorType = "sine",
  ) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {}
  }
}

const synth = new SoundSynth();

// Section-based target symbols (~20 rows per section)
const SECTION_SIZE = 20;
const SECTION_SYMBOLS: Record<number, SymbolId[][]> = {
  1: [["star_5"], ["circle_filled"]],
  2: [
    ["star_5", "circle_empty"],
    ["square_dot", "triangle_down"],
  ],
  3: [
    ["star_5", "circle_filled", "square_dot"],
  ],
};

interface SymbolCell {
  id: SymbolId;
  row: number;
  col: number;
  uniqueKey: string;
  sectionTargets: SymbolId[];
}

interface ClickResult {
  correct: boolean;
  scoreDelta: number;
  timestamp: number;
}

interface HistoryItem {
  date: string;
  level: number;
  hits: number;
  errors: number;
  missed: number;
  precision: number;
  reactionTime: number;
  score: number;
}

function Atencao({
  speech,
  onDone,
}: {
  speech: ReturnType<typeof useSpeech>;
  onDone: (r: { correct: number; total: number }) => void;
}) {
  const [phase, setPhase] = useState<"mode_select" | "intro" | "get_ready" | "playing" | "result">(
    "mode_select",
  );
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [activeTargets, setActiveTargets] = useState<SymbolId[]>([]);
  const [symbolsGrid, setSymbolsGrid] = useState<SymbolCell[][]>([]);
  const [clickedCells, setClickedCells] = useState<Record<string, ClickResult>>({});
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);

  // Game loops / timing
  const [readyCountdown, setReadyCountdown] = useState(3);

  // Reaction times & analytics
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastActionTime, setLastActionTime] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  // SVG worm path measurement
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const rowElRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [rowPositions, setRowPositions] = useState<Array<{ y: number; h: number }>>([]);
  const [gridWidth, setGridWidth] = useState(0);

  // Measure row positions after render
  useEffect(() => {
    const container = gridScrollRef.current;
    if (!container || symbolsGrid.length === 0) return;

    const positions: Array<{ y: number; h: number }> = [];
    const containerRect = container.getBoundingClientRect();

    for (let i = 0; i < symbolsGrid.length; i++) {
      const rowEl = rowElRefs.current.get(i);
      if (rowEl) {
        const rect = rowEl.getBoundingClientRect();
        positions.push({
          y: rect.top - containerRect.top + container.scrollTop,
          h: rect.height,
        });
      }
    }

    setRowPositions(positions);
    setGridWidth(container.clientWidth);
  }, [symbolsGrid, clickedCells, phase]);

  // Load local score history on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexia:atencao_history");
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch {}
    }
  }, []);

  // Speak initial intro messages
  useEffect(() => {
    if (phase === "intro") {
      speech.speak(
        `Nível ${level}. Encontre os símbolos solicitados no topo e clique neles na grade contínua. Quando o alvo mudar, um marcador aparecerá dentro da sequência indicando o novo símbolo. Continue de onde parou.`,
      );
    }
  }, [phase, level, speech]);

  // Setup ready countdown
  useEffect(() => {
    if (phase !== "get_ready") return;
    synth.playCountdownTick();
    const id = setInterval(() => {
      setReadyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          startGame();
          return 3;
        }
        synth.playCountdownTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Main playing loops (timer, target switcher, alarm beeps)
  useEffect(() => {
    if (phase !== "playing") return;

    const gameTimer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          endGame();
          return 0;
        }

        const nextTime = prev - 1;

        if (nextTime <= 10) {
          synth.playWarningBeep();
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(gameTimer);
  }, [phase, level]);

  // Compute current section from last clicked row
  const lastClickedCell = useMemo(() => {
    let maxRow = -1;
    let maxCol = -1;
    for (const key of Object.keys(clickedCells)) {
      const [r, c] = key.split("-").map(Number);
      if (r > maxRow || (r === maxRow && c > maxCol)) {
        maxRow = r;
        maxCol = c;
      }
    }
    return { row: maxRow, col: maxCol };
  }, [clickedCells]);

  const lastClickedRow = lastClickedCell.row;

  const activeSection = useMemo(() => {
    return Math.min(
      Math.floor(Math.max(0, lastClickedRow) / SECTION_SIZE),
      (SECTION_SYMBOLS[level]?.length ?? 1) - 1,
    );
  }, [lastClickedRow, level]);

  // Compute SVG snake path from measured row positions
  const computeSnakePath = useCallback(
    (positions: Array<{ y: number; h: number }>, width: number) => {
      if (positions.length === 0 || width === 0) return "";
      const pad = 14;
      const left = pad;
      const right = width - pad;
      const cx = 12;
      let d = "";

      positions.forEach((pos, i) => {
        const cy = pos.y + pos.h / 2;
        if (i === 0) {
          d += `M ${left} ${cy}`;
        }
        if (i % 2 === 0) {
          d += ` H ${right}`;
        } else {
          d += ` H ${left}`;
        }
        if (i < positions.length - 1) {
          const nextCy = positions[i + 1].y + positions[i + 1].h / 2;
          if (i % 2 === 0) {
            d += ` C ${right + cx} ${cy}, ${right + cx} ${nextCy}, ${right} ${nextCy}`;
          } else {
            d += ` C ${left - cx} ${cy}, ${left - cx} ${nextCy}, ${left} ${nextCy}`;
          }
        }
      });
      return d;
    },
    [],
  );

  // Compute partial snake path that stops at a specific row+col
  const computePartialSnakePath = useCallback(
    (
      positions: Array<{ y: number; h: number }>,
      width: number,
      stopRow: number,
      stopCol: number,
      numCols: number,
    ) => {
      if (positions.length === 0 || width === 0 || stopRow < 0) return "";
      const pad = 14;
      const left = pad;
      const right = width - pad;
      const cx = 12;
      const usableWidth = right - left;

      let d = "";

      // Draw complete rows before the termination row
      const fullRows = positions.slice(0, stopRow);
      fullRows.forEach((pos, i) => {
        const cy = pos.y + pos.h / 2;
        if (i === 0) {
          d += `M ${left} ${cy}`;
        }
        if (i % 2 === 0) {
          d += ` H ${right}`;
        } else {
          d += ` H ${left}`;
        }
        if (i < fullRows.length - 1) {
          const nextCy = positions[i + 1].y + positions[i + 1].h / 2;
          if (i % 2 === 0) {
            d += ` C ${right + cx} ${cy}, ${right + cx} ${nextCy}, ${right} ${nextCy}`;
          } else {
            d += ` C ${left - cx} ${cy}, ${left - cx} ${nextCy}, ${left} ${nextCy}`;
          }
        }
      });

      // Draw partial termination row up to the clicked column
      const termPos = positions[stopRow];
      if (!termPos) return d;
      const cy = termPos.y + termPos.h / 2;

      if (stopRow === 0 && d === "") {
        d += `M ${left} ${cy}`;
      } else if (d === "") {
        d += `M ${left} ${cy}`;
      } else {
        // Connect from previous row
        const prevPos = positions[stopRow - 1];
        if (prevPos) {
          const prevCy = prevPos.y + prevPos.h / 2;
          if ((stopRow - 1) % 2 === 0) {
            d += ` C ${right + cx} ${prevCy}, ${right + cx} ${cy}, ${right} ${cy}`;
          } else {
            d += ` C ${left - cx} ${prevCy}, ${left - cx} ${cy}, ${left} ${cy}`;
          }
        }
      }

      // Calculate X position of the clicked column
      const colFraction = stopCol / Math.max(numCols - 1, 1);
      const targetX = stopRow % 2 === 0
        ? left + colFraction * usableWidth
        : right - colFraction * usableWidth;

      d += ` H ${targetX}`;

      return d;
    },
    [],
  );

  const snakePathD = useMemo(
    () => computeSnakePath(rowPositions, gridWidth),
    [computeSnakePath, rowPositions, gridWidth],
  );

  // Traveled path stops EXACTLY at the last clicked cell
  const snakePathTraveled = useMemo(() => {
    if (lastClickedRow < 0 || rowPositions.length === 0) return "";
    const cols = level === 1 ? 8 : level === 2 ? 10 : 12;
    return computePartialSnakePath(
      rowPositions,
      gridWidth,
      lastClickedRow,
      lastClickedCell.col,
      cols,
    );
  }, [computePartialSnakePath, rowPositions, gridWidth, lastClickedRow, lastClickedCell.col, level]);

  // Initialize and start game session
  const startGame = () => {
    synth.playCountdownStart();
    const duration = level === 1 ? 60 : level === 2 ? 90 : 120;
    setTimeRemaining(duration);

    const initialTargets = SECTION_SYMBOLS[level][0];
    setActiveTargets(initialTargets);

    const rows = level === 1 ? 30 : level === 2 ? 50 : 80;
    const cols = level === 1 ? 8 : level === 2 ? 10 : 12;

    const allSymbolIds = Object.keys(SYMBOL_REGISTRY) as SymbolId[];
    const newGrid: SymbolCell[][] = [];
    for (let r = 0; r < rows; r++) {
      const sectionIdx = Math.floor(r / SECTION_SIZE);
      const cellSectionTargets = SECTION_SYMBOLS[level]?.[sectionIdx] ?? [];
      const rowCells: SymbolCell[] = [];
      for (let c = 0; c < cols; c++) {
        const randId = allSymbolIds[Math.floor(Math.random() * allSymbolIds.length)];
        rowCells.push({
          id: randId,
          row: r,
          col: c,
          uniqueKey: `${r}-${c}`,
          sectionTargets: cellSectionTargets,
        });
      }
      newGrid.push(rowCells);
    }

    setSymbolsGrid(newGrid);
    setClickedCells({});
    setHits(0);
    setErrors(0);
    setCombo(0);
    setMaxCombo((m) => Math.max(m, 0));
    setScore(0);
    setReactionTimes([]);
    setLastActionTime(Date.now());
    setCurrentSection(0);
    setPhase("playing");
  };

  const endGame = () => {
    setPhase("result");
    speech.speak("Treino finalizado. Confira seus resultados.");

    // Save results to history
    const finalReport = calculateFinalReport();
    const newRecord: HistoryItem = {
      date: new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      level,
      hits,
      errors,
      missed: finalReport.missed,
      precision: finalReport.precision,
      reactionTime: finalReport.avgReactionTime,
      score,
    };

    setHistory((prev) => {
      const updated = [newRecord, ...prev].slice(0, 10);
      try {
        localStorage.setItem("nexia:atencao_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Evaluate individual symbol click
  const handleCellClick = (cell: SymbolCell) => {
    if (clickedCells[cell.uniqueKey]) return;

    // Validation uses ONLY the cell's own sectionTargets — no global state dependency
    const isActiveTarget = cell.sectionTargets.includes(cell.id);
    const now = Date.now();
    const rt = (now - lastActionTime) / 1000;
    setLastActionTime(now);

    let pointsEarned = 0;
    let nextCombo = 0;

    if (isActiveTarget) {
      synth.playSuccess();
      setHits((h) => h + 1);
      nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((m) => Math.max(m, nextCombo));

      const factor = nextCombo >= 20 ? 5 : nextCombo >= 10 ? 3 : nextCombo >= 5 ? 2 : 1;
      pointsEarned = 100 * factor;
      setScore((s) => s + pointsEarned);
      setReactionTimes((times) => [...times, rt]);
    } else {
      synth.playFailure();
      setErrors((e) => e + 1);
      setCombo(0);
      pointsEarned = -50;
      setScore((s) => Math.max(0, s + pointsEarned));
    }

    setClickedCells((prev) => ({
      ...prev,
      [cell.uniqueKey]: {
        correct: isActiveTarget,
        scoreDelta: pointsEarned,
        timestamp: now,
      },
    }));

    // Update active section/targets for header display
    const cellSection = Math.floor(cell.row / SECTION_SIZE);
    if (cellSection !== activeSection) {
      setCurrentSection(cellSection);
      setActiveTargets(SECTION_SYMBOLS[level][cellSection]);
    }

    // Auto-scroll: keep clicked row visible
    const container = gridScrollRef.current;
    const rowEl = rowElRefs.current.get(cell.row);
    if (container && rowEl) {
      const containerRect = container.getBoundingClientRect();
      const rowRect = rowEl.getBoundingClientRect();
      const rowRelativeToContainer = rowRect.top - containerRect.top + container.scrollTop;
      const viewMid = container.clientHeight / 2;
      container.scrollTo({
        top: rowRelativeToContainer - viewMid + rowRect.height / 2,
        behavior: "smooth",
      });
    }
  };

  // Analyze final stats in processed rows
  const calculateFinalReport = () => {
    let totalTargetInstances = 0;

    for (let r = 0; r < symbolsGrid.length; r++) {
      const row = symbolsGrid[r];
      if (!row) continue;
      const sectionIdx = Math.floor(r / SECTION_SIZE);
      const sectionTargets = SECTION_SYMBOLS[level]?.[sectionIdx] ?? [];
      row.forEach((cell) => {
        if (sectionTargets.includes(cell.id)) {
          totalTargetInstances++;
        }
      });
    }

    const totalClicks = hits + errors;
    const precision = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
    const missed = Math.max(0, totalTargetInstances - hits);
    const avgReactionTime =
      reactionTimes.length > 0
        ? parseFloat((reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2))
        : 0;

    let ratingStars = 2;
    let classification: "aprovado" | "abaixo_da_media" | "reprovado" = "reprovado";
    if (precision >= 95 && avgReactionTime < 0.9) {
      ratingStars = 5;
      classification = "aprovado";
    } else if (precision >= 85 && avgReactionTime < 1.2) {
      ratingStars = 4;
      classification = "aprovado";
    } else if (precision >= 70) {
      ratingStars = 3;
      classification = "abaixo_da_media";
    }

    return {
      totalTargetInstances,
      missed,
      precision,
      avgReactionTime,
      ratingStars,
      classification,
    };
  };

  const report = calculateFinalReport();

  return (
    <div className="space-y-4">
      {/* Mode / Level Selection */}
      {phase === "mode_select" && (
        <div className="glass rounded-3xl p-6 md:p-8 space-y-6 text-center max-w-xl mx-auto shadow-glow">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center text-3xl">
            🎯
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold">
            Modo Treino de Atenção Concentrada
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Selecione o nível de dificuldade para iniciar o treinamento de concentração DETRAN. O
            teste simula o ritmo de uma avaliação psicológica profissional.
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              onClick={() => {
                setLevel(1);
                setPhase("intro");
              }}
              className="glass p-4 rounded-2xl hover:bg-accent/20 hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-36"
            >
              <div>
                <span className="text-xs font-bold text-success uppercase">Nível 1</span>
                <h3 className="font-bold text-sm mt-1">Um Único Alvo</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Procura 1 figura. Formas maiores, menos distração.
              </p>
            </button>
            <button
              onClick={() => {
                setLevel(2);
                setPhase("intro");
              }}
              className="glass p-4 rounded-2xl hover:bg-accent/20 hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-36"
            >
              <div>
                <span className="text-xs font-bold text-warning uppercase">Nível 2</span>
                <h3 className="font-bold text-sm mt-1">Dois Alvos</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Procura 2 figuras. Dificuldade e símbolos aumentados.
              </p>
            </button>
            <button
              onClick={() => {
                setLevel(3);
                setPhase("intro");
              }}
              className="glass p-4 rounded-2xl hover:bg-accent/20 hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-36"
            >
              <div>
                <span className="text-xs font-bold text-destructive uppercase">Nível 3</span>
                <h3 className="font-bold text-sm mt-1">Três Alvos</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Procura 3 figuras. Espaçamento mínimo e alta densidade.
              </p>
            </button>
          </div>

          <button
            onClick={() => onDone({ correct: 0, total: 0 })}
            className="text-xs text-muted-foreground hover:text-foreground mt-4 block mx-auto underline"
          >
            Pular Teste de Atenção
          </button>
        </div>
      )}

      {/* Intro Instructions Panel */}
      {phase === "intro" && (
        <div className="glass rounded-3xl p-6 md:p-8 space-y-6 max-w-xl mx-auto shadow-glow text-left">
          <TestHeader
            title={`Nível ${level} · Treino de Atenção`}
            subtitle="Instruções do Exercício"
          />
          <ul className="space-y-2 mb-4">
            <li className="text-xs md:text-sm flex items-start gap-2 p-3 rounded-xl bg-secondary/40 border border-border">
              <span className="text-primary font-bold">•</span>
              <span>
                Você terá <strong>{level === 1 ? "60" : level === 2 ? "90" : "120"} segundos</strong>{" "}
                para completar o teste.
              </span>
            </li>
            <li className="text-xs md:text-sm flex items-start gap-2 p-3 rounded-xl bg-secondary/40 border border-border">
              <span className="text-primary font-bold">•</span>
              <span>Encontre e clique apenas nos símbolos solicitados na barra do topo.</span>
            </li>
            <li className="text-xs md:text-sm flex items-start gap-2 p-3 rounded-xl bg-secondary/40 border border-border">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>MUDANÇA DE ALVO:</strong> Quando o alvo mudar, um <strong>marcador</strong>{" "}
                aparecerá dentro da sequência. Tudo antes dele já foi concluído — continue de onde
                parou.
              </span>
            </li>
            <li className="text-xs md:text-sm flex items-start gap-2 p-3 rounded-xl bg-secondary/40 border border-border">
              <span className="text-primary font-bold">•</span>
              <span>
                Use combos de acertos seguidos (5x, 10x, 20x) para multiplicar sua pontuação!
              </span>
            </li>
          </ul>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPhase("get_ready")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow animate-pulse cursor-pointer"
            >
              <Play className="h-4 w-4" /> [COMEÇAR]
            </button>
            <button
              onClick={() => setPhase("mode_select")}
              className="px-4 py-3 rounded-xl glass text-xs font-semibold cursor-pointer"
            >
              Voltar ao Níveis
            </button>
          </div>
        </div>
      )}

      {/* Countdown Panel */}
      {phase === "get_ready" && (
        <div className="glass rounded-3xl p-10 space-y-6 text-center max-w-md mx-auto shadow-glow flex flex-col items-center justify-center min-h-[350px]">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Prepare-se...
          </span>

          <div className="bg-black/20 p-6 rounded-2xl border border-border/20 flex flex-col items-center gap-3">
            <span className="text-xs font-semibold text-primary-glow">
              ENCONTRE ESTES SÍMBOLOS:
            </span>
            <div className="flex gap-6 items-center">
              {SECTION_SYMBOLS[level][0].map((tid) => (
                <div key={tid} className="flex items-center justify-center">
                  {SYMBOL_REGISTRY[tid]?.render(40)}
                </div>
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground text-center">
              A cada ~20 linhas o símbolo muda — observe os marcadores na sequência
            </span>
          </div>

          <motion.div
            key={readyCountdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-6xl font-display font-black text-primary"
          >
            {readyCountdown}
          </motion.div>
        </div>
      )}

      {/* Active Game Loop Screen */}
      {phase === "playing" && (
        <div className="flex flex-col max-w-3xl mx-auto h-full">
          {/* Compact Stats Bar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-t-2xl border border-border/20 border-b-0 bg-black/30 backdrop-blur-sm flex-wrap shrink-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                Encontre:
              </span>
              <div className="flex gap-1.5">
                {activeTargets.map((tid) => (
                  <div key={tid} className="animate-pulse">
                    {SYMBOL_REGISTRY[tid]?.render(20)}
                  </div>
                ))}
              </div>
              {activeSection < (SECTION_SYMBOLS[level]?.length ?? 1) - 1 && (
                <span className="text-[8px] text-cyan-300/70 hidden sm:inline">
                  (seção {activeSection + 1})
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span>
                <span className="text-muted-foreground">⏱</span>{" "}
                <span className={`font-display font-bold ${timeRemaining <= 10 ? "text-destructive" : "text-foreground"}`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                </span>
              </span>
              <span className="text-success-glow">
                ✓ <span className="font-display font-bold">{hits}</span>
              </span>
              <span className="text-destructive-glow">
                ✗ <span className="font-display font-bold">{errors}</span>
              </span>
              <span className="text-primary-glow">
                ★ <span className="font-display font-bold">{score}</span>
              </span>
              {combo >= 5 && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {combo}x🔥
                </span>
              )}
            </div>
          </div>

          {/* Grid — fills remaining space */}
          <div className="flex-1 glass rounded-b-2xl rounded-t-none p-2 md:p-3 shadow-glow bg-background/25 min-h-0">
            <div ref={gridScrollRef} className="relative flex flex-col gap-2 h-full overflow-y-auto px-2 py-2 border border-border/10 rounded-2xl bg-black/35 select-none scrollbar-thin">
              {/* SVG worm path overlay */}
              {snakePathD && (
                <svg
                  className="absolute inset-0 w-full pointer-events-none z-0"
                  style={{ height: gridScrollRef.current?.scrollHeight || "100%" }}
                >
                  {/* Future path (cyan) */}
                  <path
                    d={snakePathD}
                    stroke="rgba(34,211,238,0.10)"
                    strokeWidth="20"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Traveled path (green) */}
                  {snakePathTraveled && (
                    <path
                      d={snakePathTraveled}
                      stroke="rgba(52,211,153,0.14)"
                      strokeWidth="20"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              )}
              {(() => {
                let lastSectionIdx = -1;
                const seenSections = new Set<number>();
                return symbolsGrid.map((row, rowIndex) => {
                  const isPastSection = Math.floor(rowIndex / SECTION_SIZE) < activeSection;
                  const sectionIdx = Math.floor(rowIndex / SECTION_SIZE);
                  const sectionTargets = SECTION_SYMBOLS[level]?.[sectionIdx] ?? [];

                  const isNewSection = sectionIdx > 0 && sectionIdx !== lastSectionIdx && !seenSections.has(sectionIdx);
                  if (sectionIdx !== lastSectionIdx) {
                    lastSectionIdx = sectionIdx;
                    seenSections.add(sectionIdx);
                  }

                  return (
                    <Fragment key={rowIndex}>
                      <div
                        ref={(el) => { if (el) rowElRefs.current.set(rowIndex, el); else rowElRefs.current.delete(rowIndex); }}
                        className={`relative z-10 flex items-center gap-2 py-1 border-b border-border/5 last:border-b-0 transition-opacity duration-300 ${
                          isPastSection ? "opacity-35" : ""
                        }`}
                      >
                        <span className="text-[9px] text-muted-foreground w-4 text-right shrink-0">
                          {rowIndex + 1}
                        </span>
                        {isNewSection && (
                          <div className="flex items-center gap-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full px-1.5 py-0.5 shrink-0">
                            {sectionTargets.map((tid) => {
                              const pillSymSize = level === 1 ? 26 : level === 2 ? 22 : 18;
                              return (
                                <span key={tid}>
                                  {SYMBOL_REGISTRY[tid]?.render(pillSymSize)}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex gap-1 justify-around w-full">
                          {row.map((cell) => {
                            const result = clickedCells[cell.uniqueKey];
                            const isClicked = !!result;
                            const isCorrect = result?.correct;

                            const btnSize =
                              level === 1 ? "w-11 h-11" : level === 2 ? "w-9 h-9" : "w-8 h-8";
                            const symSize = level === 1 ? 26 : level === 2 ? 22 : 18;

                            return (
                              <button
                                key={cell.uniqueKey}
                                onClick={() => handleCellClick(cell)}
                                className={`relative rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                  isClicked
                                    ? isCorrect
                                      ? "border-success bg-success/20 shadow-success-glow"
                                      : "border-destructive bg-destructive/20 shadow-destructive-glow animate-shake"
                                    : "border-border/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 active:scale-90"
                                } ${btnSize}`}
                                disabled={isClicked}
                              >
                                {SYMBOL_REGISTRY[cell.id]?.render(symSize)}

                              {/* Float indicator badge */}
                              {isClicked && (
                                <motion.span
                                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                                  animate={{ opacity: 0, y: -25, scale: 1.1 }}
                                  transition={{ duration: 0.65, ease: "easeOut" }}
                                  className={`absolute text-[10px] font-bold pointer-events-none ${
                                    isCorrect ? "text-success-glow" : "text-destructive-glow"
                                  }`}
                                >
                                  {result.scoreDelta > 0
                                    ? `+${result.scoreDelta}`
                                    : result.scoreDelta}
                                </motion.span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      </div>
                    </Fragment>
                );
              });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Game Report/Result Dashboard */}
      {phase === "result" && (
        <div className="glass rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-glow space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-3xl mb-3 shadow-glow">
              🏆
            </div>
            <h2 className="text-2xl font-display font-bold">Treino Finalizado!</h2>
            <p className="text-muted-foreground text-xs mt-1">
              {report.classification === "aprovado"
                ? "Excelente desempenho! Continue assim para atingir o foco perfeito."
                : report.classification === "abaixo_da_media"
                  ? "Desempenho regular. Treine mais para melhorar sua precisão e velocidade."
                  : "Desempenho abaixo do esperado. pratique mais para atingir o nível necessário."}
            </p>
          </div>

          {/* Rating stars */}
          <div className="flex justify-center gap-1.5 text-2xl text-amber-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx}>{idx < report.ratingStars ? "⭐" : "☆"}</span>
            ))}
          </div>

          {/* Classification badge */}
          <div className="flex justify-center">
            <div
              className={`px-5 py-2 rounded-full font-display font-black text-sm uppercase tracking-wider border-2 ${
                report.classification === "aprovado"
                  ? "bg-success/15 border-success text-success-glow shadow-success-glow"
                  : report.classification === "abaixo_da_media"
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    : "bg-destructive/15 border-destructive text-destructive-glow shadow-destructive-glow"
              }`}
            >
              {report.classification === "aprovado"
                ? "✓ Aprovado"
                : report.classification === "abaixo_da_media"
                  ? "⚠ Abaixo da Média"
                  : "✗ Reprovado"}
            </div>
          </div>

          {/* Score details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-secondary/40 p-4 rounded-2xl border border-border text-center">
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Pontuação
              </span>
              <p className="text-xl font-display font-black mt-1 text-primary-glow">{score}</p>
            </div>
            <div className="bg-secondary/40 p-4 rounded-2xl border border-border text-center">
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Acertos / Total alvos
              </span>
              <p className="text-xl font-display font-bold mt-1 text-success-glow">
                {hits}{" "}
                <span className="text-xs text-muted-foreground">/ {hits + report.missed}</span>
              </p>
            </div>
            <div className="bg-secondary/40 p-4 rounded-2xl border border-border text-center">
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Cliques errados
              </span>
              <p className="text-xl font-display font-bold mt-1 text-destructive-glow">{errors}</p>
            </div>
            <div className="bg-secondary/40 p-4 rounded-2xl border border-border text-center">
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Alvos Não Marcados
              </span>
              <p className="text-xl font-display font-bold mt-1 text-zinc-400">{report.missed}</p>
            </div>
            <div className="bg-secondary/40 p-4 rounded-2xl border border-border text-center">
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Precisão
              </span>
              <p className="text-xl font-display font-bold mt-1">{report.precision}%</p>
            </div>
            <div className="bg-secondary/40 p-4 rounded-2xl border border-border text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Reação Média
              </span>
              <p className="text-xl font-display font-bold mt-1">{report.avgReactionTime}s</p>
            </div>
          </div>

          {/* Historical progression log */}
          {history.length > 1 && (
            <div className="bg-black/10 p-4 rounded-2xl border border-border/10 space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                📈 Histórico de Evolução
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin">
                {history.map((record, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs p-2 rounded bg-black/25"
                  >
                    <span className="text-[10px] text-muted-foreground">{record.date}</span>
                    <span className="font-semibold">Nível {record.level}</span>
                    <span className="text-success-glow">{record.hits} acertos</span>
                    <span className="font-bold">{record.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                onDone({ correct: hits, total: hits + report.missed });
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow animate-pulse cursor-pointer"
            >
              Concluir Teste e Avançar <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setPhase("mode_select")}
              className="px-4 py-3 rounded-xl glass text-xs font-semibold cursor-pointer"
            >
              Refazer Exercício
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== TEST 3: MEMÓRIA RÁPIDA =====================

function Memoria({
  speech,
  onDone,
}: {
  speech: ReturnType<typeof useSpeech>;
  onDone: (r: { items: number }) => void;
}) {
  const MEM_SECS = 60;
  const WRITE_SECS = 120;
  const [phase, setPhase] = useState<"intro" | "memorize" | "write" | "done">("intro");
  const [time, setTime] = useState(MEM_SECS);
  const [text, setText] = useState("");

  const score = useMemo(() => {
    const items = text
      .split(/[\n,;]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    // Cada elemento da imagem pontua no máximo 1 vez, mesmo que o aluno
    // escreva sinônimos (ex: "casa" e "residencia").
    let hits = 0;
    for (const element of COMPLETE_MEMORY_ELEMENTS) {
      if (items.some((userItem) => isValidAnswer(userItem, element.aliases))) {
        hits++;
      }
    }
    return hits;
  }, [text]);

  useEffect(() => {
    if (phase === "intro")
      speech.speak(
        "Teste de Memória Rápida. Dica para você ter uma boa pontuação neste teste: não tente memorizar os desenhos de forma individual, faça o agrupamento por elementos. Por exemplo, ao memorizar uma casa, não grave apenas o conceito de casa, mas sim todos os seus componentes: casa, janela, telhado, caminho, chaminé e fumaça.",
      );
  }, [phase, speech]);

  useEffect(() => {
    if (phase !== "memorize" && phase !== "write") return;
    if (time <= 0) {
      if (phase === "memorize") {
        speech.speak("Tempo! Agora escreva tudo que lembrar.");
        setPhase("write");
        setTime(WRITE_SECS);
      } else {
        setPhase("done");
        speech.speak("Tempo encerrado.");
      }
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, time, speech]);

  function finish() {
    onDone({ items: score });
  }

  function restart() {
    speech.stop();
    setText("");
    setTime(MEM_SECS);
    setPhase("intro");
  }

  return (
    <div className="glass rounded-3xl p-5 md:p-6 shadow-card">
      <TestHeader title="2/3 · Memória Rápida" subtitle="Memorize e liste o máximo de objetos" />
      {phase === "intro" && (
        <Intro
          bullets={[
            "Você verá uma cena por 30 segundos.",
            "Memorize o maior número de objetos possível.",
            "Depois, terá 60 segundos para escrever a lista.",
            "Separe os itens por vírgula ou por linha.",
          ]}
          onStart={() => {
            speech.stop();
            setText("");
            setTime(MEM_SECS);
            setPhase("memorize");
          }}
          speech={speech}
          replayText="Memorize a cena por trinta segundos. Depois liste tudo que conseguir lembrar."
        />
      )}
      {phase === "memorize" && (
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-semibold">Memorize agora</span>
            <span
              className={`font-display text-lg ${
                time <= 5 ? "text-destructive" : "text-foreground"
              }`}
            >
              {time}s
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-border overflow-hidden flex justify-center p-2">
            <img
              src={memoriaImg}
              alt="Cena para memorizar"
              className="w-full max-w-4xl max-h-[70vh] object-contain rounded-xl"
            />
          </div>
          <button onClick={() => setTime(0)} className="mt-3 px-4 py-2 rounded-xl glass text-sm">
            Já memorizei →
          </button>
        </div>
      )}
      {phase === "write" && (
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-semibold">Escreva o que lembrar</span>
            <span
              className={`font-display text-lg ${
                time <= 5 ? "text-destructive" : "text-foreground"
              }`}
            >
              {time}s
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ex: casa, árvore, carro, balão..."
            className="w-full h-48 p-4 rounded-2xl bg-background/60 border border-border text-sm leading-relaxed"
          />
          <button onClick={() => setTime(0)} className="mt-3 px-4 py-2 rounded-xl glass text-sm">
            Terminei →
          </button>
        </div>
      )}
      {phase === "done" && (
        <DoneNext
          summary={`Objetos lembrados: ${score} · ${score >= 12 ? "Aprovado" : "Reprovado"} (Mínimo: 12)`}
          onNext={finish}
          onRestart={restart}
          status={score >= 12 ? "success" : "danger"}
          nextLabel="Próximo Teste"
        />
      )}
    </div>
  );
}

// ===================== TEST 4: RACIOCÍNIO LÓGICO =====================
type LogOpt = { key: string; render: () => React.ReactNode };
type LogQuestion = {
  question: string;
  prompt?: () => React.ReactNode;
  options: LogOpt[];
  correct: string;
  explain: string;
};

type ShapeKind = "triangle" | "square" | "circle" | "diamond" | "star" | "pentagon";

// Paleta de referência (azul-marinho, verde, amarelo mostarda, vermelho tijolo)
const NAVY = "#1e2a5e";
const GRN = "#3aa455";
const YLW = "#e8a93a";
const RED = "#c8392e";
const BLU = NAVY; // compat

function CShape({
  kind,
  size = 64,
  color = NAVY,
  rotate = 0,
}: {
  kind: ShapeKind;
  size?: number;
  color?: string;
  rotate?: number;
}) {
  const t = `rotate(${rotate} 20 20)`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <g transform={t}>
        {kind === "circle" && <circle cx="20" cy="20" r="15" fill={color} />}
        {kind === "square" && <rect x="6" y="6" width="28" height="28" fill={color} />}
        {kind === "triangle" && <polygon points="20,5 35,33 5,33" fill={color} />}
        {kind === "diamond" && <polygon points="20,3 37,20 20,37 3,20" fill={color} />}
        {kind === "star" && (
          <polygon
            points="20,4 24,15 36,15 26,22 30,34 20,27 10,34 14,22 4,15 16,15"
            fill={color}
          />
        )}
        {kind === "pentagon" && <polygon points="20,4 36,16 30,34 10,34 4,16" fill={color} />}
      </g>
    </svg>
  );
}

const tri = (key: string, color = NAVY) => (
  <CShape key={key} kind="triangle" size={64} color={color} />
);
const sq = (key: string, color = NAVY) => (
  <CShape key={key} kind="square" size={64} color={color} />
);
const ci = (key: string, color = NAVY) => (
  <CShape key={key} kind="circle" size={64} color={color} />
);
const di = (key: string, color = NAVY) => (
  <CShape key={key} kind="diamond" size={64} color={color} />
);
const st = (key: string, color = NAVY) => <CShape key={key} kind="star" size={64} color={color} />;

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-1 justify-center items-center flex-wrap">{children}</div>;
}

function Arrow({
  dir,
  size = 56,
  color = NAVY,
  rotate,
}: {
  dir?: "up" | "right" | "down" | "left";
  size?: number;
  color?: string;
  rotate?: number;
}) {
  const rot = rotate !== undefined ? rotate : { up: -90, right: 0, down: 90, left: 180 }[dir || "right"];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <g transform={`rotate(${rot} 20 20)`}>
        {/* Seta cheia estilo bloco */}
        <polygon points="4,15 22,15 22,8 36,20 22,32 22,25 4,25" fill={color} />
      </g>
    </svg>
  );
}

function Dots({ n }: { n: number }) {
  const arr = Array.from({ length: n });
  const cols = Math.min(n, 4);
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {arr.map((_, i) => (
        <span key={i} className="block w-3 h-3 rounded-full" style={{ background: NAVY }} />
      ))}
    </div>
  );
}

function Grid2x2({ fill, color = NAVY }: { fill: Array<0 | 1 | 2 | 3>; color?: string }) {
  const cell = (i: 0 | 1 | 2 | 3) => {
    const x = i % 2 === 0 ? 4 : 33;
    const y = i < 2 ? 4 : 33;
    return fill.includes(i) ? (
      <rect key={i} x={x} y={y} width="27" height="27" fill={color} />
    ) : null;
  };
  return (
    <svg width="72" height="72" viewBox="0 0 64 64">
      <rect x="1" y="1" width="62" height="62" fill="none" stroke="#bfc4d1" strokeWidth="1.5" />
      <line x1="32" y1="1" x2="32" y2="63" stroke="#bfc4d1" strokeWidth="1.5" />
      <line x1="1" y1="32" x2="63" y2="32" stroke="#bfc4d1" strokeWidth="1.5" />
      {([0, 1, 2, 3] as const).map(cell)}
    </svg>
  );
}

// Célula da matriz 2x2 estilo psicotécnico
type MCell =
  | { type: "shape"; kind: ShapeKind; color?: string; rotate?: number }
  | { type: "arrow"; dir?: "up" | "right" | "down" | "left"; color?: string }
  | { type: "custom"; render: () => React.ReactNode }
  | { type: "q" }
  | { type: "empty" };

function MatrixCell({ c }: { c: MCell }) {
  return (
    <div
      className="aspect-square bg-white flex items-center justify-center p-1 overflow-hidden"
      style={{ border: "1.5px solid #9aa0ad" }}
    >
      {c.type === "shape" && (
        <CShape kind={c.kind} color={c.color ?? NAVY} rotate={c.rotate ?? 0} size={78} />
      )}
      {c.type === "arrow" && <Arrow dir={c.dir} color={c.color ?? NAVY} size={68} />}
      {c.type === "custom" && c.render()}
      {c.type === "q" && <span className="text-5xl font-light text-zinc-400">?</span>}
    </div>
  );
}

function Matrix2x2({ cells }: { cells: [MCell, MCell, MCell, MCell] }) {
  return (
    <div className="mx-auto grid grid-cols-2 gap-2 max-w-[280px]">
      {cells.map((c, i) => (
        <MatrixCell key={i} c={c} />
      ))}
    </div>
  );
}

function Matrix2x3({ cells }: { cells: MCell[] }) {
  return (
    <div className="mx-auto grid grid-cols-3 gap-2 max-w-[400px]">
      {cells.map((c, i) => (
        <MatrixCell key={i} c={c} />
      ))}
    </div>
  );
}

function Matrix3x3({ cells }: { cells: MCell[] }) {
  return (
    <div className="mx-auto grid grid-cols-3 gap-2 max-w-[360px]">
      {cells.map((c, i) => (
        <MatrixCell key={i} c={c} />
      ))}
    </div>
  );
}

// Helper: opção como célula única (mesmo estilo)
const optShape =
  (kind: ShapeKind, color = NAVY) =>
  () => (
    <div
      className="aspect-square w-full flex items-center justify-center bg-white"
      style={{ border: "1.5px solid #9aa0ad" }}
    >
      <CShape kind={kind} color={color} size={68} />
    </div>
  );

const optArrow =
  (dir: "up" | "right" | "down" | "left", color = NAVY) =>
  () => (
    <div
      className="aspect-square w-full flex items-center justify-center bg-white"
      style={{ border: "1.5px solid #9aa0ad" }}
    >
      <Arrow dir={dir} color={color} size={60} />
    </div>
  );

const optCustom =
  (render: () => React.ReactNode) =>
  () => (
    <div
      className="aspect-square w-full flex items-center justify-center bg-white p-1 overflow-hidden"
      style={{ border: "1.5px solid #9aa0ad" }}
    >
      {render()}
    </div>
  );

// Helpers para montar células da matriz
const sC = (kind: ShapeKind, color = NAVY, rotate = 0): MCell => ({
  type: "shape",
  kind,
  color,
  rotate,
});

const aC = (dir: "up" | "right" | "down" | "left", color = NAVY): MCell => ({
  type: "arrow",
  dir,
  color,
});

const Q: MCell = { type: "q" };

// Helpers para rendering complexo na Fase 3 e 4
const renderShapes = (kind: ShapeKind, color: string, count: number) => () => {
  const gridCols = count <= 3 ? count : count === 4 ? 2 : 3;
  return (
    <div
      className="grid gap-1 justify-items-center items-center"
      style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <CShape key={idx} kind={kind} color={color} size={28} />
      ))}
    </div>
  );
};

const renderSemicircle = (dir: "left" | "right" | "up" | "down", color = NAVY) => () => {
  let d = "";
  if (dir === "left") d = "M20,5 A15,15 0 0,0 20,35 Z";
  if (dir === "right") d = "M20,5 A15,15 0 0,1 20,35 Z";
  if (dir === "up") d = "M5,20 A15,15 0 0,1 35,20 Z";
  if (dir === "down") d = "M5,20 A15,15 0 0,0 35,20 Z";
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      <path d={d} fill={color} />
    </svg>
  );
};

const renderSquareCorners = (corners: ("TL" | "TR" | "BL" | "BR")[], color = NAVY) => () => {
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      {corners.includes("TL") && <rect x="6" y="6" width="14" height="14" fill={color} />}
      {corners.includes("TR") && <rect x="20" y="6" width="14" height="14" fill={color} />}
      {corners.includes("BL") && <rect x="6" y="20" width="14" height="14" fill={color} />}
      {corners.includes("BR") && <rect x="20" y="20" width="14" height="14" fill={color} />}
    </svg>
  );
};

const renderDoubleDots = (pos: "horizontal" | "vertical", color1: string, color2: string) => () => {
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      {pos === "horizontal" ? (
        <>
          <circle cx="12" cy="20" r="6" fill={color1} />
          <circle cx="28" cy="20" r="6" fill={color2} />
        </>
      ) : (
        <>
          <circle cx="20" cy="12" r="6" fill={color1} />
          <circle cx="20" cy="28" r="6" fill={color2} />
        </>
      )}
    </svg>
  );
};

const renderDoubleShapes = (
  pos: "horizontal" | "vertical",
  kind1: ShapeKind,
  color1: string,
  kind2: ShapeKind,
  color2: string
) => () => {
  return (
    <div className={`flex gap-2 items-center justify-center ${pos === "vertical" ? "flex-col" : "flex-row"}`}>
      <CShape kind={kind1} color={color1} size={30} />
      <CShape kind={kind2} color={color2} size={30} />
    </div>
  );
};

const renderSemicircleArc = (dir: "left" | "right" | "up" | "down", color = NAVY) => () => {
  let d = "";
  if (dir === "left") d = "M20,5 A15,15 0 0,0 20,35";
  if (dir === "right") d = "M20,5 A15,15 0 0,1 20,35";
  if (dir === "up") d = "M5,20 A15,15 0 0,1 35,20";
  if (dir === "down") d = "M5,20 A15,15 0 0,0 35,20";
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

const renderOverlay = (parts: ("circle" | "square" | "horiz" | "vert" | "diag")[], color = NAVY) => () => {
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      {parts.includes("circle") && <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth="3" />}
      {parts.includes("square") && <rect x="6" y="6" width="28" height="28" fill="none" stroke={color} strokeWidth="3" />}
      {parts.includes("horiz") && <line x1="6" y1="20" x2="34" y2="20" stroke={color} strokeWidth="3" />}
      {parts.includes("vert") && <line x1="20" y1="6" x2="20" y2="34" stroke={color} strokeWidth="3" />}
      {parts.includes("diag") && <line x1="6" y1="6" x2="34" y2="34" stroke={color} strokeWidth="3" />}
    </svg>
  );
};

const renderSubtraction = (shape: "circle" | "square" | "triangle" | "none", hasLine: boolean, color = NAVY) => () => {
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      {shape === "circle" && <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth="3" />}
      {shape === "square" && <rect x="6" y="6" width="28" height="28" fill="none" stroke={color} strokeWidth="3" />}
      {shape === "triangle" && <polygon points="20,6 34,32 6,32" fill="none" stroke={color} strokeWidth="3" />}
      {hasLine && <line x1="20" y1="6" x2="20" y2="32" stroke={color} strokeWidth="3" />}
    </svg>
  );
};

const renderCornerDots = (corner: "TL" | "TR" | "BL" | "BR", color1 = NAVY, color2 = RED) => () => {
  const coords = {
    TL: [{ cx: 10, cy: 10 }, { cx: 20, cy: 10 }],
    TR: [{ cx: 30, cy: 10 }, { cx: 20, cy: 10 }],
    BR: [{ cx: 30, cy: 30 }, { cx: 20, cy: 30 }],
    BL: [{ cx: 10, cy: 30 }, { cx: 20, cy: 30 }],
  }[corner];
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      <circle cx={coords[0].cx} cy={coords[0].cy} r="4" fill={color1} />
      <circle cx={coords[1].cx} cy={coords[1].cy} r="4" fill={color2} />
    </svg>
  );
};

const renderThreeDots = (colors: string[]) => () => {
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      <circle cx="20" cy="10" r="4" fill={colors[0]} />
      <circle cx="20" cy="20" r="4" fill={colors[1]} />
      <circle cx="20" cy="30" r="4" fill={colors[2]} />
    </svg>
  );
};

const renderNestedShapes = (outer: ShapeKind, inner: ShapeKind, color = NAVY) => () => {
  return (
    <svg width="68" height="68" viewBox="0 0 40 40">
      {/* Outer shape (drawn larger and with outline only) */}
      {outer === "circle" && <circle cx="20" cy="20" r="15" fill="none" stroke={color} strokeWidth="2.5" />}
      {outer === "square" && <rect x="5" y="5" width="30" height="30" fill="none" stroke={color} strokeWidth="2.5" />}
      {outer === "triangle" && <polygon points="20,5 35,32 5,32" fill="none" stroke={color} strokeWidth="2.5" />}
      
      {/* Inner shape (drawn smaller and filled) */}
      {inner === "circle" && <circle cx="20" cy="20" r="6" fill={color} />}
      {inner === "square" && <rect x="14" y="14" width="12" height="12" fill={color} />}
      {inner === "triangle" && <polygon points="20,13 27,25 13,25" fill={color} />}
    </svg>
  );
};

// FASE 1 (Q1-5): Matrizes 2x2 Simples
const LOG_QUESTIONS: LogQuestion[] = [
  {
    question: "Observe a matriz e descubra a figura que completa o conjunto:",
    prompt: () => <Matrix2x2 cells={[sC("diamond"), sC("diamond"), sC("diamond"), Q]} />,
    options: [
      { key: "A", render: optShape("circle") },
      { key: "B", render: optShape("diamond") },
      { key: "C", render: optShape("square") },
      { key: "D", render: optShape("diamond", GRN) },
    ],
    correct: "B",
    explain: "Todas as células contêm o mesmo losango azul; a quarta segue o padrão.",
  },
  {
    question: "Qual figura completa a matriz?",
    prompt: () => (
      <Matrix2x2 cells={[sC("circle", RED), sC("circle", NAVY), sC("circle", RED), Q]} />
    ),
    options: [
      { key: "A", render: optShape("circle", RED) },
      { key: "B", render: optShape("circle", NAVY) },
      { key: "C", render: optShape("circle", GRN) },
      { key: "D", render: optShape("circle", YLW) },
    ],
    correct: "B",
    explain: "1ª coluna = vermelho, 2ª coluna = azul. Falta o círculo azul na segunda coluna.",
  },
  {
    question: "Qual figura completa a matriz?",
    prompt: () => <Matrix2x2 cells={[sC("triangle"), sC("square"), sC("triangle"), Q]} />,
    options: [
      { key: "A", render: optShape("triangle") },
      { key: "B", render: optShape("circle") },
      { key: "C", render: optShape("square") },
      { key: "D", render: optShape("diamond") },
    ],
    correct: "C",
    explain: "Cada linha contém triângulo seguido de quadrado. Falta o quadrado na segunda linha.",
  },
  {
    question: "Qual figura completa a matriz?",
    prompt: () => <Matrix2x2 cells={[sC("circle"), sC("triangle"), Q, sC("triangle")]} />,
    options: [
      { key: "A", render: optShape("square") },
      { key: "B", render: optShape("circle") },
      { key: "C", render: optShape("triangle") },
      { key: "D", render: optShape("diamond") },
    ],
    correct: "B",
    explain: "A 1ª coluna tem círculos, a 2ª tem triângulos. Falta o círculo embaixo.",
  },
  {
    question: "Qual seta completa a matriz de inversão?",
    prompt: () => <Matrix2x2 cells={[aC("left"), aC("right"), aC("left"), Q]} />,
    options: [
      { key: "A", render: optArrow("left") },
      { key: "B", render: optArrow("right") },
      { key: "C", render: optArrow("up") },
      { key: "D", render: optArrow("down") },
    ],
    correct: "B",
    explain: "A seta inverte a direção horizontalmente na linha (esquerda para direita). Falta a seta para a direita.",
  },
  // FASE 2 (Q6-10): Matrizes 2x3 — Permutação de 3 atributos
  {
    question: "Na linha 2, qual cor completa a sequência? (Cada cor aparece uma vez por linha)",
    prompt: () => (
      <Matrix2x3 cells={[sC("circle", NAVY), sC("circle", GRN), sC("circle", YLW), sC("circle", GRN), sC("circle", YLW), Q]} />
    ),
    options: [
      { key: "A", render: optShape("circle", NAVY) },
      { key: "B", render: optShape("circle", GRN) },
      { key: "C", render: optShape("circle", YLW) },
      { key: "D", render: optShape("circle", RED) },
    ],
    correct: "A",
    explain: "Cada linha contém azul, verde e amarelo em permutação. Na linha 2 falta azul.",
  },
  {
    question: "Qual forma completa a sequência na linha 2? (Cada forma aparece uma vez por linha)",
    prompt: () => (
      <Matrix2x3 cells={[sC("triangle"), sC("square"), sC("circle"), sC("circle"), sC("triangle"), Q]} />
    ),
    options: [
      { key: "A", render: optShape("circle") },
      { key: "B", render: optShape("triangle") },
      { key: "C", render: optShape("square") },
      { key: "D", render: optShape("diamond") },
    ],
    correct: "C",
    explain: "Cada linha tem triângulo, quadrado e círculo. Na linha 2 falta o quadrado.",
  },
  {
    question: "Qual seta completa a sequência na linha 2?",
    prompt: () => (
      <Matrix2x3 cells={[aC("up"), aC("right"), aC("down"), aC("down"), aC("up"), Q]} />
    ),
    options: [
      { key: "A", render: optArrow("up") },
      { key: "B", render: optArrow("right") },
      { key: "C", render: optArrow("down") },
      { key: "D", render: optArrow("left") },
    ],
    correct: "B",
    explain: "Cada linha tem cima, direita e baixo. Na linha 2 falta a direita.",
  },
  {
    question: "Qual combinação de cor e forma completa a matriz?",
    prompt: () => (
      <Matrix2x3 cells={[
        sC("triangle", NAVY), sC("square", GRN), sC("circle", YLW),
        sC("square", YLW), sC("circle", NAVY), Q
      ]} />
    ),
    options: [
      { key: "A", render: optShape("triangle", NAVY) },
      { key: "B", render: optShape("triangle", GRN) },
      { key: "C", render: optShape("square", NAVY) },
      { key: "D", render: optShape("circle", GRN) },
    ],
    correct: "B",
    explain: "Cada linha contém triângulo, quadrado e círculo associados a azul, verde e amarelo de forma permutada. Falta o triângulo verde.",
  },
  {
    question: "A linha 2 é o espelho da linha 1. Qual figura completa a sequência?",
    prompt: () => (
      <Matrix2x3 cells={[sC("diamond", RED), sC("diamond", NAVY), sC("diamond", GRN), sC("diamond", GRN), sC("diamond", NAVY), Q]} />
    ),
    options: [
      { key: "A", render: optShape("diamond", RED) },
      { key: "B", render: optShape("diamond", NAVY) },
      { key: "C", render: optShape("diamond", GRN) },
      { key: "D", render: optShape("diamond", YLW) },
    ],
    correct: "A",
    explain: "A linha 2 espelha a linha 1: verde, azul, vermelho. Falta o diamante vermelho.",
  },
  // FASE 3 (Q11-20): Proporção, Contagem e Rotação Angular
  {
    question: "As setas giram 90 graus no sentido horário. Qual completa?",
    prompt: () => <Matrix2x2 cells={[aC("up"), aC("right"), aC("down"), Q]} />,
    options: [
      { key: "A", render: optArrow("up") },
      { key: "B", render: optArrow("right") },
      { key: "C", render: optArrow("down") },
      { key: "D", render: optArrow("left") },
    ],
    correct: "D",
    explain: "Cima -> direita -> baixo -> esquerda (giro de 90 graus no sentido horário).",
  },
  {
    question: "Analise a proporção numérica de objetos. Qual grupo completa?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderShapes("triangle", NAVY, 3) },
        { type: "custom", render: renderShapes("square", GRN, 6) },
        { type: "custom", render: renderShapes("triangle", NAVY, 2) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderShapes("square", GRN, 4)) },
      { key: "B", render: optCustom(renderShapes("square", GRN, 3)) },
      { key: "C", render: optCustom(renderShapes("triangle", GRN, 4)) },
      { key: "D", render: optCustom(renderShapes("square", GRN, 2)) },
    ],
    correct: "A",
    explain: "A proporção é de 1 triângulo para 2 quadrados. Como temos 2 triângulos embaixo, precisamos de 4 quadrados verdes.",
  },
  {
    question: "A figura gira 45 graus a cada passo. Qual completa?",
    prompt: () => (
      <Matrix2x2 cells={[sC("diamond", NAVY, 0), sC("diamond", NAVY, 45), sC("diamond", NAVY, 90), Q]} />
    ),
    options: [
      { key: "A", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="diamond" color={NAVY} size={68} rotate={135} /></div> },
      { key: "B", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="diamond" color={NAVY} size={68} rotate={180} /></div> },
      { key: "C", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="diamond" color={NAVY} size={68} rotate={225} /></div> },
      { key: "D", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="diamond" color={NAVY} size={68} rotate={270} /></div> },
    ],
    correct: "A",
    explain: "0° -> 45° -> 90° -> 135°. Cada etapa gira 45 graus no sentido horário.",
  },
  {
    question: "Analise a proporção de multiplicação de objetos. Qual grupo completa?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderShapes("star", YLW, 1) },
        { type: "custom", render: renderShapes("star", YLW, 3) },
        { type: "custom", render: renderShapes("circle", RED, 2) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderShapes("circle", RED, 6)) },
      { key: "B", render: optCustom(renderShapes("circle", RED, 4)) },
      { key: "C", render: optCustom(renderShapes("star", YLW, 6)) },
      { key: "D", render: optCustom(renderShapes("circle", RED, 8)) },
    ],
    correct: "A",
    explain: "A segunda célula tem o triplo de objetos da primeira. A quarta deve ter o triplo da terceira (2 círculos * 3 = 6 círculos vermelhos).",
  },
  {
    question: "A seta rotaciona em eixos de 90 graus. Qual completa?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: () => <Arrow rotate={45} color={NAVY} size={68} /> },
        { type: "custom", render: () => <Arrow rotate={135} color={NAVY} size={68} /> },
        { type: "custom", render: () => <Arrow rotate={225} color={NAVY} size={68} /> },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={315} color={NAVY} size={60} /></div> },
      { key: "B", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={45} color={NAVY} size={60} /></div> },
      { key: "C", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={270} color={NAVY} size={60} /></div> },
      { key: "D", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={180} color={NAVY} size={60} /></div> },
    ],
    correct: "A",
    explain: "As setas estão girando 90 graus no sentido horário: 45° -> 135° -> 225° -> 315°.",
  },
  {
    question: "Observe a contagem de elementos por linha. Qual completa?",
    prompt: () => (
      <Matrix2x3 cells={[
        { type: "custom", render: renderShapes("circle", NAVY, 1) },
        { type: "custom", render: renderShapes("circle", NAVY, 2) },
        { type: "custom", render: renderShapes("circle", NAVY, 3) },
        { type: "custom", render: renderShapes("triangle", NAVY, 2) },
        { type: "custom", render: renderShapes("triangle", NAVY, 3) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderShapes("triangle", NAVY, 4)) },
      { key: "B", render: optCustom(renderShapes("triangle", NAVY, 3)) },
      { key: "C", render: optCustom(renderShapes("triangle", NAVY, 5)) },
      { key: "D", render: optCustom(renderShapes("circle", NAVY, 4)) },
    ],
    correct: "A",
    explain: "A quantidade de elementos aumenta em 1 a cada coluna. A linha 2 começa com 2 triângulos, passa para 3 e deve terminar com 4.",
  },
  {
    question: "A forma gira e muda de cor de acordo com o ângulo. Qual completa?",
    prompt: () => (
      <Matrix2x2 cells={[sC("triangle", NAVY, 0), sC("triangle", GRN, 90), sC("triangle", YLW, 180), Q]} />
    ),
    options: [
      { key: "A", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="triangle" color={RED} size={68} rotate={270} /></div> },
      { key: "B", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="triangle" color={NAVY} size={68} rotate={270} /></div> },
      { key: "C", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="triangle" color={GRN} size={68} rotate={270} /></div> },
      { key: "D", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><CShape kind="triangle" color={YLW} size={68} rotate={270} /></div> },
    ],
    correct: "A",
    explain: "A cor muda (azul -> verde -> amarelo -> vermelho) à medida que o triângulo gira 90 graus no sentido horário. Falta o triângulo vermelho rotacionado em 270°.",
  },
  {
    question: "A quantidade de objetos é reduzida de forma proporcional. Qual completa?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderShapes("square", NAVY, 4) },
        { type: "custom", render: renderShapes("square", NAVY, 2) },
        { type: "custom", render: renderShapes("circle", RED, 8) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderShapes("circle", RED, 4)) },
      { key: "B", render: optCustom(renderShapes("circle", RED, 2)) },
      { key: "C", render: optCustom(renderShapes("circle", RED, 6)) },
      { key: "D", render: optCustom(renderShapes("square", NAVY, 4)) },
    ],
    correct: "A",
    explain: "A quantidade de elementos cai pela metade na segunda coluna. 8 círculos vermelhos divididos por 2 resulta em 4 círculos vermelhos.",
  },
  {
    question: "As setas realizam uma inversão no eixo diagonal (180 graus). Qual completa?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: () => <Arrow rotate={45} color={NAVY} size={68} /> },
        { type: "custom", render: () => <Arrow rotate={225} color={NAVY} size={68} /> },
        { type: "custom", render: () => <Arrow rotate={315} color={NAVY} size={68} /> },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={135} color={NAVY} size={60} /></div> },
      { key: "B", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={315} color={NAVY} size={60} /></div> },
      { key: "C", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={45} color={NAVY} size={60} /></div> },
      { key: "D", render: () => <div className="aspect-square w-full flex items-center justify-center bg-white" style={{ border: "1.5px solid #9aa0ad" }}><Arrow rotate={225} color={NAVY} size={60} /></div> },
    ],
    correct: "A",
    explain: "A diagonal superior-direita (45°) inverte para a inferior-esquerda (225°). A diagonal superior-esquerda (315°) deve inverter para a inferior-direita (135°).",
  },
  {
    question: "Observe o aumento de itens por coluna e a troca de forma. Qual completa?",
    prompt: () => (
      <Matrix2x3 cells={[
        { type: "custom", render: renderShapes("square", NAVY, 1) },
        { type: "custom", render: renderShapes("circle", NAVY, 2) },
        { type: "custom", render: renderShapes("triangle", NAVY, 3) },
        { type: "custom", render: renderShapes("square", NAVY, 2) },
        { type: "custom", render: renderShapes("circle", NAVY, 3) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderShapes("triangle", NAVY, 4)) },
      { key: "B", render: optCustom(renderShapes("triangle", NAVY, 3)) },
      { key: "C", render: optCustom(renderShapes("circle", NAVY, 4)) },
      { key: "D", render: optCustom(renderShapes("square", NAVY, 3)) },
    ],
    correct: "A",
    explain: "A segunda linha tem N+1 elementos correspondentes da primeira. A última coluna tem triângulos, portanto precisamos de 4 triângulos (3 + 1).",
  },
  // FASE 4 (Q21-30): Geometria Complementar e Pares
  {
    question: "Duas formas se unem para formar um círculo completo. Qual completa o par?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderSemicircle("left", NAVY) },
        { type: "custom", render: renderSemicircle("right", NAVY) },
        { type: "custom", render: renderSemicircle("up", NAVY) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderSemicircle("down", NAVY)) },
      { key: "B", render: optCustom(renderSemicircle("up", NAVY)) },
      { key: "C", render: optCustom(renderSemicircle("left", NAVY)) },
      { key: "D", render: optCustom(() => <CShape kind="circle" color={NAVY} size={50} />) },
    ],
    correct: "A",
    explain: "As metades esquerda e direita formam o círculo na primeira linha. Embaixo, a metade superior se completa com a metade inferior.",
  },
  {
    question: "As peças se encaixam para formar um quadrado completo. Qual completa o par?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderSquareCorners(["TL", "BR"], NAVY) },
        { type: "custom", render: renderSquareCorners(["TR", "BL"], NAVY) },
        { type: "custom", render: renderSquareCorners(["TL", "TR"], NAVY) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderSquareCorners(["BL", "BR"], NAVY)) },
      { key: "B", render: optCustom(renderSquareCorners(["TL", "TR"], NAVY)) },
      { key: "C", render: optCustom(renderSquareCorners(["TL", "BR"], NAVY)) },
      { key: "D", render: optCustom(() => <CShape kind="square" color={NAVY} size={50} />) },
    ],
    correct: "A",
    explain: "As diagonais opostas formam o quadrado em cima. Embaixo, a metade superior precisa da metade inferior (cantos inferior-esquerdo e inferior-direito) para completar o quadrado.",
  },
  {
    question: "Dois elementos trocam de posição e cor no espaço. Qual completa o par?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderDoubleDots("horizontal", NAVY, RED) },
        { type: "custom", render: renderDoubleDots("horizontal", RED, NAVY) },
        { type: "custom", render: renderDoubleDots("vertical", GRN, YLW) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderDoubleDots("vertical", YLW, GRN)) },
      { key: "B", render: optCustom(renderDoubleDots("vertical", GRN, YLW)) },
      { key: "C", render: optCustom(renderDoubleDots("horizontal", YLW, GRN)) },
      { key: "D", render: optCustom(renderDoubleDots("horizontal", NAVY, RED)) },
    ],
    correct: "A",
    explain: "O par inverte a posição e as cores na segunda célula. Verde em cima / amarelo embaixo torna-se amarelo em cima / verde embaixo.",
  },
  {
    question: "As formas duplas rotacionam no sentido anti-horário. Qual completa?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderDoubleShapes("horizontal", "triangle", NAVY, "circle", GRN) },
        { type: "custom", render: renderDoubleShapes("vertical", "triangle", NAVY, "circle", GRN) },
        { type: "custom", render: renderDoubleShapes("horizontal", "star", YLW, "diamond", RED) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderDoubleShapes("vertical", "star", YLW, "diamond", RED)) },
      { key: "B", render: optCustom(renderDoubleShapes("vertical", "diamond", RED, "star", YLW)) },
      { key: "C", render: optCustom(renderDoubleShapes("horizontal", "star", YLW, "diamond", RED)) },
      { key: "D", render: optCustom(renderDoubleShapes("horizontal", "diamond", RED, "star", YLW)) },
    ],
    correct: "A",
    explain: "A orientação muda de horizontal para vertical mantendo a ordem relativa de rotação anti-horária de 90° (elemento da esquerda vai para cima).",
  },
  {
    question: "Os arcos circulares são complementares. Qual completa o semicírculo?",
    prompt: () => (
      <Matrix2x2 cells={[
        { type: "custom", render: renderSemicircleArc("up", NAVY) },
        { type: "custom", render: renderSemicircleArc("down", NAVY) },
        { type: "custom", render: renderSemicircleArc("left", NAVY) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderSemicircleArc("right", NAVY)) },
      { key: "B", render: optCustom(renderSemicircleArc("left", NAVY)) },
      { key: "C", render: optCustom(renderSemicircleArc("up", NAVY)) },
      { key: "D", render: optCustom(renderSemicircleArc("down", NAVY)) },
    ],
    correct: "A",
    explain: "O arco superior é complementado pelo arco inferior na primeira linha. Embaixo, o arco esquerdo se complementa com o direito.",
  },
  {
    question: "Observe a sobreposição lógica de linhas (Célula 3 = Célula 1 + Célula 2). Qual completa?",
    prompt: () => (
      <Matrix3x3 cells={[
        { type: "custom", render: renderOverlay(["horiz"]) },
        { type: "custom", render: renderOverlay(["vert"]) },
        { type: "custom", render: renderOverlay(["horiz", "vert"]) },
        { type: "custom", render: renderOverlay(["circle"]) },
        { type: "custom", render: renderOverlay(["horiz", "vert"]) },
        { type: "custom", render: renderOverlay(["circle", "horiz", "vert"]) },
        { type: "custom", render: renderOverlay(["square"]) },
        { type: "custom", render: renderOverlay(["diag"]) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderOverlay(["square", "diag"])) },
      { key: "B", render: optCustom(renderOverlay(["square", "horiz", "vert"])) },
      { key: "C", render: optCustom(renderOverlay(["diag"])) },
      { key: "D", render: optCustom(renderOverlay(["square"])) },
    ],
    correct: "A",
    explain: "A terceira célula de cada linha é a soma/sobreposição das duas primeiras. A última célula deve ser o quadrado com a linha diagonal dentro.",
  },
  {
    question: "Observe a subtração lógica de formas (Célula 3 = Célula 1 - Célula 2). Qual completa?",
    prompt: () => (
      <Matrix3x3 cells={[
        { type: "custom", render: renderSubtraction("circle", true) },
        { type: "custom", render: renderSubtraction("circle", false) },
        { type: "custom", render: renderSubtraction("none", true) },
        { type: "custom", render: renderSubtraction("square", true) },
        { type: "custom", render: renderSubtraction("none", true) },
        { type: "custom", render: renderSubtraction("square", false) },
        { type: "custom", render: renderSubtraction("triangle", true) },
        { type: "custom", render: renderSubtraction("none", true) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderSubtraction("triangle", false)) },
      { key: "B", render: optCustom(renderSubtraction("triangle", true)) },
      { key: "C", render: optCustom(renderSubtraction("none", true)) },
      { key: "D", render: optCustom(renderSubtraction("square", false)) },
    ],
    correct: "A",
    explain: "A terceira célula subtrai os traços comuns ou específicos da segunda célula em relação à primeira. Triângulo com linha menos linha resulta no triângulo vazio.",
  },
  {
    question: "Dois elementos se movem no sentido horário pelas pontas do grid. Qual completa?",
    prompt: () => (
      <Matrix3x3 cells={[
        { type: "custom", render: renderCornerDots("TL") },
        { type: "custom", render: renderCornerDots("TR") },
        { type: "custom", render: renderCornerDots("BR") },
        { type: "custom", render: renderCornerDots("TR") },
        { type: "custom", render: renderCornerDots("BR") },
        { type: "custom", render: renderCornerDots("BL") },
        { type: "custom", render: renderCornerDots("BR") },
        { type: "custom", render: renderCornerDots("BL") },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderCornerDots("TL")) },
      { key: "B", render: optCustom(renderCornerDots("TR")) },
      { key: "C", render: optCustom(renderCornerDots("BR")) },
      { key: "D", render: optCustom(renderCornerDots("BL")) },
    ],
    correct: "A",
    explain: "As bolinhas movem-se um canto por vez no sentido horário (TL -> TR -> BR). Na última linha, BR -> BL -> TL (superior esquerdo).",
  },
  {
    question: "Três elementos realizam uma permutação circular vertical. Qual completa?",
    prompt: () => (
      <Matrix3x3 cells={[
        { type: "custom", render: renderThreeDots([NAVY, GRN, RED]) },
        { type: "custom", render: renderThreeDots([GRN, RED, NAVY]) },
        { type: "custom", render: renderThreeDots([RED, NAVY, GRN]) },
        { type: "custom", render: renderThreeDots([GRN, RED, NAVY]) },
        { type: "custom", render: renderThreeDots([RED, NAVY, GRN]) },
        { type: "custom", render: renderThreeDots([NAVY, GRN, RED]) },
        { type: "custom", render: renderThreeDots([RED, NAVY, GRN]) },
        { type: "custom", render: renderThreeDots([NAVY, GRN, RED]) },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderThreeDots([GRN, RED, NAVY])) },
      { key: "B", render: optCustom(renderThreeDots([RED, NAVY, GRN])) },
      { key: "C", render: optCustom(renderThreeDots([NAVY, GRN, RED])) },
      { key: "D", render: optCustom(renderThreeDots([NAVY, RED, GRN])) },
    ],
    correct: "A",
    explain: "Em cada linha, as bolinhas sobem uma posição ciclicamente. Na última linha: vermelho-azul-verde torna-se azul-verde-vermelho e depois verde-vermelho-azul.",
  },
  {
    question: "Analise a matriz de pares e formas internas complementares. Qual completa?",
    prompt: () => (
      <Matrix3x3 cells={[
        { type: "custom", render: renderNestedShapes("triangle", "circle") },
        { type: "custom", render: renderNestedShapes("triangle", "square") },
        { type: "custom", render: renderNestedShapes("triangle", "triangle") },
        { type: "custom", render: renderNestedShapes("circle", "square") },
        { type: "custom", render: renderNestedShapes("circle", "triangle") },
        { type: "custom", render: renderNestedShapes("circle", "circle") },
        { type: "custom", render: renderNestedShapes("square", "triangle") },
        { type: "custom", render: renderNestedShapes("square", "circle") },
        Q
      ]} />
    ),
    options: [
      { key: "A", render: optCustom(renderNestedShapes("square", "square")) },
      { key: "B", render: optCustom(renderNestedShapes("square", "circle")) },
      { key: "C", render: optCustom(renderNestedShapes("square", "triangle")) },
      { key: "D", render: optCustom(renderNestedShapes("circle", "square")) },
    ],
    correct: "A",
    explain: "A forma externa é constante por linha (triângulos, círculos, quadrados). A forma interna segue a permutação (círculo, quadrado, triângulo). Falta o quadrado com quadrado interno.",
  },
];

function Logico({
  speech,
  onDone,
}: {
  speech: ReturnType<typeof useSpeech>;
  onDone: (r: { correct: number; total: number }) => void;
}) {
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [time, setTime] = useState(60);

  useEffect(() => {
    if (phase === "intro")
      speech.speak(
        "Teste de raciocínio lógico. Você tem 1 minuto. Olhe as figuras geométricas e escolha a alternativa correta o mais rápido que puder.",
      );
  }, [phase, speech]);

  useEffect(() => {
    if (phase !== "running") return;
    if (time <= 0) {
      setPhase("done");
      speech.speak("Tempo encerrado.");
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, time, speech]);

  const q = LOG_QUESTIONS[i];

  function next() {
    setPicked(null);
    if (i + 1 >= LOG_QUESTIONS.length) {
      setPhase("done");
    } else {
      setI(i + 1);
    }
  }

  return (
    <div className="glass rounded-3xl p-5 md:p-6 shadow-card">
      <TestHeader
        title="3/3 · Raciocínio Lógico"
        subtitle="Figuras geométricas — encontre o padrão"
      />
      {phase === "intro" && (
        <Intro
          bullets={[
            `${LOG_QUESTIONS.length} questões de figuras, padrões e sequências.`,
            "Cada pergunta tem 4 alternativas (A, B, C, D).",
            "Modo treino: ao errar, mostramos a explicação do padrão.",
            "Analise lados, posição, cor e rotação com calma.",
          ]}
          onStart={() => {
            speech.stop();
            setI(0);
            setCorrect(0);
            setPicked(null);
            setTime(60);
            setPhase("running");
          }}
          speech={speech}
          replayText="Escolha a alternativa correta para cada pergunta de figuras geométricas."
        />
      )}
      {phase === "running" && (
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-3 bg-secondary/30 border border-border/20 px-4 py-2.5 rounded-2xl flex-wrap gap-2">
            <div>
              Questão <span className="text-primary-glow font-bold">{i + 1}</span>/{LOG_QUESTIONS.length}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-success-glow">
                Acertos: <span className="font-bold">{correct}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className={`h-4 w-4 ${time <= 10 ? "text-destructive animate-pulse" : "text-primary"}`} />
                <span className={`font-display font-bold ${time <= 10 ? "text-destructive" : "text-foreground"}`}>
                  {time}s
                </span>
              </span>
            </div>
          </div>
          <p className="text-base md:text-lg font-medium mb-4">{q.question}</p>
          {q.prompt && <div className="mb-5">{q.prompt()}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {q.options.map((opt) => {
              const isPicked = picked === opt.key;
              const isCorrect = q.correct === opt.key;
              const reveal = picked !== null;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    if (picked !== null) return;
                    setPicked(opt.key);
                    if (opt.key === q.correct) setCorrect((c) => c + 1);
                  }}
                  className={`rounded-2xl border-2 bg-white p-4 flex flex-col items-center gap-2 transition-all ${
                    reveal && isCorrect
                      ? "border-success bg-success/10"
                      : reveal && isPicked
                        ? "border-destructive bg-destructive/10"
                        : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="self-start text-xs font-bold text-zinc-700">{opt.key}</span>
                  {opt.render()}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {picked !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-2xl border ${
                  picked === q.correct
                    ? "border-success/40 bg-success/5"
                    : "border-destructive/40 bg-destructive/5"
                }`}
              >
                <p className="text-sm font-semibold flex items-center gap-2">
                  {picked === q.correct ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  Resposta: {q.correct}
                </p>
                <p className="text-sm text-foreground/90 mt-1">{q.explain}</p>
                <button
                  onClick={next}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold"
                >
                  {i + 1 >= LOG_QUESTIONS.length ? "Ver resultado" : "Próxima"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {phase === "done" && (
        <DoneNext
          summary={`${correct}/${LOG_QUESTIONS.length} acertos lógicos · ${correct >= 21 ? "Aprovado" : "Reprovado"} (Mínimo: 21)`}
          onNext={() => onDone({ correct, total: LOG_QUESTIONS.length })}
          status={correct >= 21 ? "success" : "danger"}
        />
      )}
    </div>
  );
}

// ===================== Shared components =====================
function TestHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">{title}</p>
      <h2 className="text-xl font-display font-bold">{subtitle}</h2>
    </div>
  );
}

function Intro({
  bullets,
  onStart,
  speech,
  replayText,
}: {
  bullets: string[];
  onStart: () => void;
  speech: ReturnType<typeof useSpeech>;
  replayText: string;
}) {
  return (
    <div>
      <ul className="space-y-2 mb-4">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="text-sm flex items-start gap-2 p-3 rounded-xl bg-secondary/40 border border-border"
          >
            <span className="text-primary font-bold">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
        >
          <Play className="h-4 w-4" /> Iniciar
        </button>
        <button
          onClick={() => speech.speak(replayText)}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl glass text-sm"
        >
          <Volume2 className="h-4 w-4" /> Ouvir novamente
        </button>
      </div>
    </div>
  );
}

function DoneNext({
  summary,
  onNext,
  onRestart,
  status,
  nextLabel = "Continuar",
}: {
  summary: string;
  onNext: () => void;
  onRestart?: () => void;
  status?: "success" | "danger";
  nextLabel?: string;
}) {
  const isDanger = status === "danger";
  return (
    <div className="text-center py-6">
      {isDanger ? (
        <X className="h-10 w-10 text-destructive mx-auto" />
      ) : (
        <Check className="h-10 w-10 text-success mx-auto" />
      )}
      <p className="mt-2 font-semibold">{summary}</p>
      {onRestart ? (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Refazer Teste
          </button>
          <button
            onClick={onNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow cursor-pointer"
          >
            {nextLabel} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onNext}
          className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow cursor-pointer"
        >
          {nextLabel} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Result({ scores, onRestart }: { scores: ScoreMap; onRestart: () => void }) {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-glow">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 shadow-glow">
          <Trophy className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold">Avaliação Psicotécnica Concluída</h2>
        <p className="text-muted-foreground mt-1">Veja seu desempenho em cada teste.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        <ResultCard
          title="Atenção"
          lines={[`Acertos: ${scores.atencao?.correct ?? 0}/${scores.atencao?.total ?? 0}`]}
        />
        <ResultCard
          title="Memória rápida"
          lines={[`Objetos lembrados: ${scores.memoria?.items ?? 0}`]}
          status={(scores.memoria?.items ?? 0) >= 12 ? "success" : "danger"}
          requiredText="Mínimo exigido: 12 objetos"
        />
        <ResultCard
          title="Raciocínio lógico"
          lines={[`Acertos: ${scores.logico?.correct ?? 0}/${scores.logico?.total ?? 0}`]}
          status={scores.logico ? ((scores.logico.correct ?? 0) >= 21 ? "success" : "danger") : undefined}
          requiredText="Mínimo exigido: 21 acertos (70%)"
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
        >
          <RotateCcw className="h-4 w-4" /> Refazer avaliação
        </button>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass font-semibold"
        >
          Início
        </Link>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  lines,
  status,
  requiredText,
}: {
  title: string;
  lines: string[];
  status?: "success" | "danger";
  requiredText?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="space-y-0.5">
          {lines.map((l, i) => (
            <p key={i} className="text-sm font-semibold">
              {l}
            </p>
          ))}
        </div>
        {requiredText && (
          <p className="text-xs text-muted-foreground mt-1">{requiredText}</p>
        )}
      </div>
      {status && (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            status === "success"
              ? "bg-success/20 border border-success/40 text-success"
              : "bg-destructive/20 border border-destructive/40 text-destructive"
          }`}
        >
          {status === "success" ? (
            <>
              <Check className="h-3 w-3" /> Aprovado
            </>
          ) : (
            <>
              <X className="h-3.5 w-3.5" /> Reprovado
            </>
          )}
        </span>
      )}
    </div>
  );
}
