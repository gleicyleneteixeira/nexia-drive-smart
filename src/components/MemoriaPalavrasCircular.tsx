import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, RotateCcw, Trophy, XCircle } from "lucide-react";

export interface ResultadoCircular {
  acertos: number;
  totalAlvo: number;
  extrasMarcadas: number;
  naoMarcadas: number;
  palavrasAcertadas: string[];
  palavrasEsquecidas: string[];
  palavrasExtras: string[];
}

interface Props {
  speech: {
    enabled: boolean;
    setEnabled: (value: ((previous: boolean) => boolean) | boolean) => void;
    speak: (text: string) => void;
    stop: () => void;
  };
  onDone: (acertos: number) => void;
  onBack: () => void;
}

type Phase = "memorize" | "answer" | "result";

const PALAVRAS_ALVO = [
  "CASA",
  "RIO",
  "CHAVE",
  "PONTE",
  "SOL",
  "LIVRO",
  "JANELA",
  "BARCO",
  "PEDRA",
  "RELÓGIO",
  "FOLHA",
  "PORTA",
  "ÁRVORE",
  "ESCOLA",
  "AVIÃO",
  "CIDADE",
  "TRIGO",
  "LUZ",
  "MAPA",
  "CANETA",
  "SAPATO",
  "NUVEM",
  "CAMINHÃO",
  "PANELA",
  "JARDIM",
  "ESTRADA",
  "MOEDA",
  "LEÃO",
  "FOGUETE",
  "CADEIRA",
  "CORAÇÃO",
  "REDE",
  "TREM",
  "FLORES",
  "TESOURA",
  "CAVALO",
  "BICICLETA",
  "QUEIJO",
  "RELOGIO",
];

const PALAVRAS_DISTRACTORAS = [
  "CAMPO",
  "LAGO",
  "CADEADO",
  "PASSARELA",
  "LUZ",
  "CADERNO",
  "PORTÃO",
  "CARRO",
  "ROCHA",
  "CALENDÁRIO",
  "GALHO",
  "JANELA",
  "IGREJA",
  "QUADRO",
  "AVENIDA",
  "CANETA",
  "NAVE",
  "MOEDA",
  "SAPATO",
  "FLORESTA",
  "MESA",
  "CHAVEIRO",
  "ESTRELA",
  "CANAL",
  "JARDIM",
  "CAMINHO",
  "VENTO",
  "PRAÇA",
  "TREM",
  "REDE",
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function MemoriaPalavrasCircular({ speech, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("memorize");
  const [memorizeSeconds, setMemorizeSeconds] = useState(60);
  const [answerSeconds, setAnswerSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [palavrasAlvo, setPalavrasAlvo] = useState<string[]>([]);
  const [palavrasGrade, setPalavrasGrade] = useState<string[]>([]);
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set());
  const [resultado, setResultado] = useState<ResultadoCircular | null>(null);
  const marcadasRef = useRef<Set<string>>(new Set());
  const rodadaAnteriorRef = useRef<Set<string>>(new Set());

  function gerarRodada() {
    const anteriores = rodadaAnteriorRef.current;
    const poolNovo = anteriores.size
      ? PALAVRAS_ALVO.filter((palavra) => !anteriores.has(palavra))
      : [...PALAVRAS_ALVO];
    const poolCompleto = poolNovo.length >= 15 ? poolNovo : [...PALAVRAS_ALVO];
    const alvo = shuffle(poolCompleto).slice(0, 15);
    rodadaAnteriorRef.current = new Set(alvo);
    const palavrasAlvoSet = new Set(PALAVRAS_ALVO);
    const distratorasDisponiveis = PALAVRAS_DISTRACTORAS.filter(
      (palavra) => !palavrasAlvoSet.has(palavra),
    );
    const distratoras = shuffle(distratorasDisponiveis).slice(0, 21);
    setPalavrasAlvo(alvo);
    setPalavrasGrade(shuffle([...alvo, ...distratoras]));
  }

  useEffect(() => {
    gerarRodada();
  }, []);

  useEffect(() => {
    if (phase === "memorize") setTimeLeft(memorizeSeconds);
  }, [phase, memorizeSeconds]);

  useEffect(() => {
    if (phase === "answer") setTimeLeft(answerSeconds);
  }, [phase, answerSeconds]);

  useEffect(() => {
    if (phase === "result") return;
    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          if (phase === "memorize") {
            setPhase("answer");
            setTimeLeft(answerSeconds);
            speech.speak("Tempo de memorização encerrado. Marque as palavras que lembrar.");
            return answerSeconds;
          }
          finalizar();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [answerSeconds, phase, speech]);

  function irParaResposta() {
    speech.stop();
    setPhase("answer");
  }

  function togglePalavra(palavra: string) {
    setMarcadas((previous) => {
      const next = new Set(previous);
      if (next.has(palavra)) next.delete(palavra);
      else next.add(palavra);
      marcadasRef.current = next;
      return next;
    });
  }

  function finalizar() {
    const marcadasAtual = marcadasRef.current;
    const alvo = new Set(palavrasAlvo);
    const acertadas = palavrasAlvo.filter((palavra) => marcadasAtual.has(palavra));
    const esquecidas = palavrasAlvo.filter((palavra) => !marcadasAtual.has(palavra));
    const extras = Array.from(marcadasAtual).filter((palavra) => !alvo.has(palavra));
    setResultado({
      acertos: acertadas.length,
      totalAlvo: palavrasAlvo.length,
      extrasMarcadas: extras.length,
      naoMarcadas: esquecidas.length,
      palavrasAcertadas: acertadas,
      palavrasEsquecidas: esquecidas,
      palavrasExtras: extras,
    });
    speech.speak(
      `Teste concluído. Você acertou ${acertadas.length} de ${palavrasAlvo.length} palavras.`,
    );
    setPhase("result");
  }

  function jogarNovamente() {
    speech.stop();
    gerarRodada();
    setMarcadas(new Set());
    marcadasRef.current = new Set();
    setResultado(null);
    setTimeLeft(memorizeSeconds);
    setPhase("memorize");
  }

  const aprovado = resultado !== null && resultado.acertos >= 12;

  return (
    <div className="space-y-4">
      {phase === "memorize" && (
        <section className="glass rounded-3xl p-5 md:p-7 shadow-card">
          <div className="sticky top-2 z-30 flex items-center justify-between gap-3 rounded-xl bg-background/95 pb-3 border-b border-border/10 backdrop-blur">
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
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Memória de palavras · Folha 1
                </p>
                <p className="mt-1 text-sm font-semibold">Memorize estas palavras</p>
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

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {palavrasAlvo.map((palavra) => (
              <div
                key={palavra}
                className="rounded-xl border border-border/60 bg-background/60 px-3 py-4 text-center font-display text-sm font-bold tracking-wide shadow-card"
              >
                {palavra}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Tempo para memorizar
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[45, 60].map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => setMemorizeSeconds(seconds)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                      memorizeSeconds === seconds
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 bg-secondary/40"
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={irParaResposta}
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              Já memorizei <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {phase === "answer" && (
        <section className="glass rounded-3xl p-5 md:p-7 shadow-card">
          <div className="sticky top-2 z-30 flex items-center justify-between gap-3 rounded-xl bg-background/95 pb-3 border-b border-border/10 backdrop-blur">
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
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Memória de palavras · Folha 2
                </p>
                <p className="mt-1 text-sm font-semibold">Circule apenas as palavras lembradas</p>
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

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Tempo para circular
              </p>
              <div className="flex gap-2">
                {[60, 90].map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => setAnswerSeconds(seconds)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                      answerSeconds === seconds
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 bg-secondary/40"
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {marcadas.size} palavra{marcadas.size === 1 ? "" : "s"} circulada
              {marcadas.size === 1 ? "" : "s"}
            </p>
          </div>

          <div className="palavras-grade mt-4" aria-label="Grade de palavras para circular">
            {palavrasGrade.map((palavra) => {
              const marcada = marcadas.has(palavra);
              return (
                <button
                  key={palavra}
                  type="button"
                  onClick={() => togglePalavra(palavra)}
                  aria-pressed={marcada}
                  className={`palavra-circular ${marcada ? "palavra-circular--marcada" : ""}`}
                >
                  {palavra}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={finalizar}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Finalizar e ver resultado <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {phase === "result" && resultado && (
        <section className="glass rounded-3xl p-5 md:p-8 shadow-card">
          <div className="text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                aprovado
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {aprovado ? <Trophy className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Resultado
            </p>
            <h2
              className={`mt-1 text-3xl font-display font-black ${
                aprovado ? "text-emerald-500" : "text-destructive"
              }`}
            >
              {aprovado ? "APROVADO" : "REPROVADO"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você acertou {resultado.acertos} de {resultado.totalAlvo} palavras
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <ResultadoNumero valor={resultado.acertos} rotulo="Acertos" cor="text-emerald-500" />
            <ResultadoNumero
              valor={resultado.extrasMarcadas}
              rotulo="Marcadas a mais"
              cor="text-destructive"
            />
            <ResultadoNumero
              valor={resultado.naoMarcadas}
              rotulo="Não marcadas"
              cor="text-amber-500"
            />
          </div>

          <ResultadoLista
            titulo="Palavras acertadas"
            palavras={resultado.palavrasAcertadas}
            vazio="Nenhuma palavra da folha original foi acertada."
            cor="text-emerald-500"
          />
          <ResultadoLista
            titulo="Palavras esquecidas"
            palavras={resultado.palavrasEsquecidas}
            vazio="Nenhuma palavra foi esquecida."
            cor="text-amber-500"
          />
          <ResultadoLista
            titulo="Marcações indevidas"
            palavras={resultado.palavrasExtras}
            vazio="Nenhuma palavra distratora foi marcada."
            cor="text-destructive"
          />

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={jogarNovamente}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              <RotateCcw className="h-4 w-4" /> Jogar novamente
            </button>
            <button
              type="button"
              onClick={() => onDone(resultado.acertos)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl glass px-5 py-3 font-semibold"
            >
              Próximo teste <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
        </section>
      )}
    </div>
  );
}

function ResultadoNumero({ valor, rotulo, cor }: { valor: number; rotulo: string; cor: string }) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3 text-center">
      <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{rotulo}</p>
    </div>
  );
}

function ResultadoLista({
  titulo,
  palavras,
  vazio,
  cor,
}: {
  titulo: string;
  palavras: string[];
  vazio: string;
  cor: string;
}) {
  return (
    <div className="mt-3 rounded-xl border border-border/50 bg-background/30 p-3">
      <p className={`text-xs font-bold ${cor}`}>{titulo}</p>
      {palavras.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {palavras.map((palavra) => (
            <span
              key={palavra}
              className="rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-[11px]"
            >
              {palavra}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">{vazio}</p>
      )}
    </div>
  );
}
