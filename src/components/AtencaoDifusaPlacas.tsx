import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, RotateCcw, Trophy, XCircle } from "lucide-react";

interface PlacaKm {
  number: number;
  label: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
  found: boolean;
  position: number;
  shake: boolean;
}

type Phase = "setup" | "playing" | "result";

const TEST_SECONDS = 60;
const TEST_TIME_OPTIONS = [60, 120, 240];
const APPROVAL_SCORE = 20;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createPlacas(): PlacaKm[] {
  const positions = shuffle(Array.from({ length: 56 }, (_, position) => position)).slice(0, 50);

  return shuffle(Array.from({ length: 50 }, (_, index) => index + 1)).map((number, index) => ({
    number,
    label: String(number).padStart(2, "0"),
    rotation: Math.round((Math.random() * 36 - 18) * 10) / 10,
    offsetX: Math.round(Math.random() * 12 - 6),
    offsetY: Math.round(Math.random() * 12 - 6),
    found: false,
    position: positions[index],
    shake: false,
  }));
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function AtencaoDifusaPlacas({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [placas, setPlacas] = useState<PlacaKm[]>([]);
  const [expectedNumber, setExpectedNumber] = useState(1);
  const [errors, setErrors] = useState(0);
  const [testSeconds, setTestSeconds] = useState(TEST_SECONDS);
  const [timeLeft, setTimeLeft] = useState(TEST_SECONDS);
  const deadlineRef = useRef(0);
  const finishedRef = useRef(false);

  const foundCount = useMemo(() => placas.filter((placa) => placa.found).length, [placas]);

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setTimeLeft((previous) => previous);
    setPhase("result");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) finishTest();
    }, 250);
    return () => window.clearInterval(timer);
  }, [finishTest, phase]);

  function startTest() {
    const now = Date.now();
    setPlacas(createPlacas());
    setExpectedNumber(1);
    setErrors(0);
    setTimeLeft(testSeconds);
    deadlineRef.current = now + testSeconds * 1000;
    finishedRef.current = false;
    setPhase("playing");
  }

  function handlePlacaClick(number: number) {
    if (phase !== "playing") return;
    const placa = placas.find((item) => item.number === number);
    if (!placa || placa.found) return;

    if (number === expectedNumber) {
      setPlacas((previous) =>
        previous.map((item) =>
          item.number === number ? { ...item, found: true, shake: false } : item,
        ),
      );
      if (number === 50) {
        setExpectedNumber(51);
        window.setTimeout(finishTest, 350);
      } else {
        setExpectedNumber((previous) => previous + 1);
      }
      return;
    }

    setErrors((previous) => previous + 1);
    setPlacas((previous) =>
      previous.map((item) => (item.number === number ? { ...item, shake: true } : item)),
    );
    window.setTimeout(() => {
      setPlacas((previous) =>
        previous.map((item) => (item.number === number ? { ...item, shake: false } : item)),
      );
    }, 420);
  }

  const approved = foundCount >= APPROVAL_SCORE;

  return (
    <div className="space-y-4 pb-8">
      {phase !== "playing" && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs font-medium hover:bg-accent/30"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos testes
        </button>
      )}

      {phase === "setup" && (
        <section className="mx-auto max-w-xl space-y-5 rounded-3xl glass p-6 text-center shadow-glow md:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              TEACO - DIFUSA
            </p>
            <h2 className="mt-1 text-2xl font-display font-bold">
              Atenção Difusa — Placas 01 a 50
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Localize e circule as placas em ordem crescente: 01, 02, 03… até 50.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Tempo do teste</p>
              <div className="grid grid-cols-3 gap-2">
                {TEST_TIME_OPTIONS.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => setTestSeconds(seconds)}
                    className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${
                      testSeconds === seconds
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 bg-secondary/40 hover:bg-accent/40"
                    }`}
                  >
                    {seconds / 60} {seconds === 60 ? "minuto" : "minutos"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="text-xl font-bold">20</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Corte sugerido
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={startTest}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Começar TEACO - DIFUSA
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {phase === "playing" && (
        <section className="mx-auto max-w-6xl space-y-3">
          <div className="sticky top-2 z-30 flex items-center justify-between rounded-2xl border border-border/60 bg-background/95 px-4 py-3 shadow-card backdrop-blur">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg glass hover:bg-accent/30"
                aria-label="Voltar aos testes"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  TEACO - DIFUSA
                </p>
                <p className="text-xs text-muted-foreground">Encontradas: {foundCount} de 50</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-lg font-bold ${
                timeLeft <= 10 ? "bg-destructive/15 text-destructive" : "bg-secondary/60"
              }`}
              aria-live="polite"
            >
              <Clock3 className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="placas-arena">
            {placas
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((placa) => (
                <button
                  key={placa.number}
                  type="button"
                  onClick={() => handlePlacaClick(placa.number)}
                  disabled={placa.found}
                  aria-label={`Placa quilométrica ${placa.label}`}
                  className={`placa-km ${placa.found ? "placa-km--found" : ""} ${
                    placa.shake ? "placa-km--shake" : ""
                  }`}
                  style={
                    {
                      "--placa-rotation": `${placa.rotation}deg`,
                      "--placa-offset-x": `${placa.offsetX}px`,
                      "--placa-offset-y": `${placa.offsetY}px`,
                    } as React.CSSProperties
                  }
                >
                  <span className="placa-km__top">NORTE</span>
                  <span className="placa-km__middle">
                    <span>km</span>
                    <strong>{placa.label}</strong>
                  </span>
                  <span className="placa-km__bottom">SP</span>
                </button>
              ))}
          </div>
        </section>
      )}

      {phase === "result" && (
        <section className="mx-auto max-w-xl space-y-5 rounded-3xl glass p-6 text-center shadow-glow md:p-8">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              approved ? "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"
            }`}
          >
            {approved ? <Trophy className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Resultado
            </p>
            <h2
              className={`mt-1 text-3xl font-display font-black ${
                approved ? "text-emerald-500" : "text-destructive"
              }`}
            >
              {approved ? "APROVADO" : "REPROVADO"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você encontrou {foundCount} de 50 placas na sequência correta.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-secondary/40 p-4">
              <p className="text-2xl font-bold text-primary">{foundCount}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Encontradas
              </p>
            </div>
            <div className="rounded-xl bg-secondary/40 p-4">
              <p className="text-2xl font-bold text-destructive">{errors}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Cliques fora de ordem
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={startTest}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              <RotateCcw className="h-4 w-4" /> Refazer teste
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl glass px-5 py-3 font-semibold"
            >
              Próximo teste <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
