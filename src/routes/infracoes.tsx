import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, ExternalLink, Lightbulb, Search, Scale } from "lucide-react";
import { GRAVIDADE_META, INFRACOES, type GravidadeInfracao } from "@/data/infractions";

export const Route = createFileRoute("/infracoes")({
  component: InfracoesPage,
  head: () => ({
    meta: [
      { title: "Infrações de Trânsito — CTB · Nexia Drive" },
      {
        name: "description",
        content:
          "Consulte infrações do CTB por gravidade, pontos, valor da multa, penalidade e medida administrativa.",
      },
    ],
  }),
});

const filtros: { id: GravidadeInfracao | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "leve", label: "Leve (3 pts)" },
  { id: "media", label: "Média (4 pts)" },
  { id: "grave", label: "Grave (5 pts)" },
  { id: "gravissima", label: "Gravíssima (7 pts)" },
];

const filtrosMultiplicador = [
  { id: "todos", label: "Todos os fatores" },
  { id: "sem", label: "Sem multiplicador" },
  ...Array.from(
    new Set(
      INFRACOES.flatMap((infracao) => (infracao.multiplicador ? [infracao.multiplicador] : [])),
    ),
  )
    .sort((a, b) => a - b)
    .map((multiplicador) => ({
      id: `x${multiplicador}`,
      label: `${multiplicador}x`,
    })),
  { id: "variavel", label: "Fator variável" },
];

const dinheiro = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

function correspondeAoMultiplicador(infracao: (typeof INFRACOES)[number], filtro: string) {
  if (filtro === "todos") return true;
  if (filtro === "sem") return !infracao.multiplicador && !infracao.fatorMulta;
  if (filtro === "variavel") return Boolean(infracao.fatorMulta);
  return infracao.multiplicador === Number(filtro.slice(1));
}

function InfracoesPage() {
  const [gravidade, setGravidade] = useState<GravidadeInfracao | "todas">("todas");
  const [multiplicador, setMultiplicador] = useState("todos");
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    return INFRACOES.filter((infracao) => {
      if (gravidade !== "todas" && infracao.gravidade !== gravidade) {
        return false;
      }
      if (gravidade === "gravissima" && !correspondeAoMultiplicador(infracao, multiplicador)) {
        return false;
      }
      if (!termo) return true;
      return normalizar(
        [
          infracao.artigo,
          infracao.descricao,
          infracao.termosBusca,
          infracao.pegadinha,
          infracao.penalidade,
          infracao.medidaAdministrativa,
          GRAVIDADE_META[infracao.gravidade].label,
        ].join(" "),
      ).includes(termo);
    });
  }, [busca, gravidade, multiplicador]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-12">
      <header className="space-y-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <BookOpen className="h-4 w-4" />
          Guia de estudo
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Infrações de <span className="gradient-text">Trânsito (CTB)</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Consulte infrações frequentes nas provas, compare gravidade e penalidades e revise as
          pegadinhas mais comuns.
        </p>
      </header>

      <section aria-label="Filtros das infrações" className="space-y-4">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {filtros.map((filtro) => {
            const active = gravidade === filtro.id;
            const quantidade =
              filtro.id === "todas"
                ? INFRACOES.length
                : INFRACOES.filter((item) => item.gravidade === filtro.id).length;
            return (
              <button
                key={filtro.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setGravidade(filtro.id);
                  if (filtro.id !== "gravissima") setMultiplicador("todos");
                }}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors md:text-sm ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : filtro.id !== "todas"
                      ? `${GRAVIDADE_META[filtro.id].className} hover:bg-accent`
                      : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
                }`}
              >
                {filtro.label}
                <span className="ml-1.5 opacity-70">{quantidade}</span>
              </button>
            );
          })}
        </div>

        {gravidade === "gravissima" && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Fator multiplicador</p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {filtrosMultiplicador.map((filtro) => {
                const active = multiplicador === filtro.id;
                const quantidade = INFRACOES.filter(
                  (infracao) =>
                    infracao.gravidade === "gravissima" &&
                    correspondeAoMultiplicador(infracao, filtro.id),
                ).length;
                return (
                  <button
                    key={filtro.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMultiplicador(filtro.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {filtro.label}
                    <span className="ml-1.5 opacity-70">{quantidade}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label className="relative block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por celular, velocidade, farol, estacionamento, artigo..."
            aria-label="Buscar infrações por descrição, situação ou artigo do CTB"
            className="h-12 w-full rounded-2xl border border-border bg-card/60 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </section>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p aria-live="polite">
          {lista.length} {lista.length === 1 ? "infração encontrada" : "infrações encontradas"}
        </p>
        {(busca || gravidade !== "todas" || multiplicador !== "todos") && (
          <button
            type="button"
            onClick={() => {
              setBusca("");
              setGravidade("todas");
              setMultiplicador("todos");
            }}
            className="font-medium text-primary hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {lista.length > 0 ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {lista.map((infracao) => {
            const meta = GRAVIDADE_META[infracao.gravidade];
            const multaBase = infracao.multaBase ?? meta.multaBase;
            const valor = multaBase * (infracao.multiplicador ?? 1);
            return (
              <li
                key={infracao.id}
                className="glass flex min-w-0 flex-col rounded-2xl p-4 transition-colors hover:bg-accent/20 md:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
                  >
                    {meta.label} · {infracao.pontuacao ?? `${meta.pontos} pts`}
                  </span>
                  <span className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium">
                    {infracao.artigo}
                  </span>
                </div>

                <h2 className="mt-3 text-base font-semibold leading-snug md:text-lg">
                  {infracao.descricao}
                </h2>

                <div className="mt-4 rounded-xl border border-border/70 bg-background/30 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Scale className="h-4 w-4 text-primary" />
                    Multa base: {dinheiro.format(multaBase)}
                    {infracao.multiplicador
                      ? ` · ${infracao.multiplicador}x = ${dinheiro.format(valor)}`
                      : infracao.fatorMulta
                        ? ` · fator ${infracao.fatorMulta}`
                        : " · sem multiplicador"}
                  </div>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Penalidade</dt>
                      <dd className="mt-0.5 leading-relaxed">{infracao.penalidade}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Medida administrativa
                      </dt>
                      <dd className="mt-0.5 leading-relaxed">{infracao.medidaAdministrativa}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-3 flex gap-2 rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-sm leading-relaxed">
                  <Lightbulb
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                  />
                  <p>
                    <span className="font-semibold text-amber-200">Pegadinha de prova: </span>
                    {infracao.pegadinha}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="glass rounded-2xl px-5 py-14 text-center">
          <p className="font-semibold">Nenhuma infração encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente outro termo ou limpe os filtros para ver todas as infrações cadastradas.
          </p>
        </div>
      )}

      <footer className="flex flex-col gap-2 rounded-2xl border border-border bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Valores-base previstos no CTB. Confira a redação vigente e as regulamentações aplicáveis
          no texto oficial.
        </p>
        <a
          href="https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          Consultar CTB oficial <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </footer>
    </main>
  );
}
