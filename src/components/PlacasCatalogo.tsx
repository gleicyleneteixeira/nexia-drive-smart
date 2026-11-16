import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Info, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import catalogoJson from "@/data/placas-catalog-named.json";
import { PLACA_STUDY_DATA } from "@/data/placas-study";

// ==========================================
// CATÁLOGO DE PLACAS — peças compartilhadas
// Usado pela página /placas e pelo bloco de
// estudo dentro do TEÓRICO (app.tsx).
// ==========================================

export type CategoriaPlaca =
  | "advertencia"
  | "regulamentacao"
  | "identificacao"
  | "servicos"
  | "turisticas"
  | "obras";
export type FiltroCategoria = "todas" | CategoriaPlaca;

export interface PlacaCatalogo {
  code?: string | null;
  category?: string | null;
  name?: string | null;
  file?: string;
  public_url?: string | null;
}

export const CATALOGO: PlacaCatalogo[] = (
  catalogoJson as unknown as PlacaCatalogo[]
).filter((p) => !!p.public_url && !!p.name);

export const CATEGORIA_META: Record<
  CategoriaPlaca,
  {
    label: string;
    upper: string;
    dot: string;
    chipAtivo: string;
    chipHover: string;
    badge: string;
    glow: string;
  }
> = {
  advertencia: {
    label: "Advertência",
    upper: "ADVERTÊNCIA",
    dot: "bg-amber-500",
    chipAtivo: "bg-amber-500/20 border-amber-500/40 text-amber-400",
    chipHover: "hover:text-amber-400",
    badge: "bg-amber-500/15 border-amber-500/35 text-amber-400",
    glow: "hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]",
  },
  regulamentacao: {
    label: "Regulamentação",
    upper: "REGULAMENTAÇÃO",
    dot: "bg-red-500",
    chipAtivo: "bg-destructive/20 border-destructive/40 text-destructive-glow",
    chipHover: "hover:text-destructive-glow",
    badge: "bg-destructive/15 border-destructive/35 text-destructive-glow",
    glow: "hover:border-destructive/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]",
  },
  identificacao: {
    label: "Identificação",
    upper: "IDENTIFICAÇÃO",
    dot: "bg-emerald-500",
    chipAtivo: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    chipHover: "hover:text-emerald-400",
    badge: "bg-emerald-500/15 border-emerald-500/35 text-emerald-400",
    glow: "hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]",
  },
  servicos: {
    label: "Serviços",
    upper: "SERVIÇOS",
    dot: "bg-sky-500",
    chipAtivo: "bg-sky-500/20 border-sky-500/40 text-sky-400",
    chipHover: "hover:text-sky-400",
    badge: "bg-sky-500/15 border-sky-500/35 text-sky-400",
    glow: "hover:border-sky-500/60 hover:shadow-[0_0_15px_rgba(14,165,233,0.25)]",
  },
  turisticas: {
    label: "Turísticas",
    upper: "TURÍSTICAS",
    dot: "bg-amber-700",
    chipAtivo: "bg-amber-700/25 border-amber-700/45 text-amber-600",
    chipHover: "hover:text-amber-600",
    badge: "bg-amber-700/20 border-amber-700/35 text-amber-600",
    glow: "hover:border-amber-700/60 hover:shadow-[0_0_15px_rgba(180,83,9,0.25)]",
  },
  obras: {
    label: "Obras",
    upper: "OBRAS",
    dot: "bg-orange-500",
    chipAtivo: "bg-orange-500/20 border-orange-500/40 text-orange-400",
    chipHover: "hover:text-orange-400",
    badge: "bg-orange-500/15 border-orange-500/35 text-orange-400",
    glow: "hover:border-orange-500/60 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)]",
  },
};

export const CONTAGENS: Record<FiltroCategoria, number> = {
  todas: CATALOGO.length,
  advertencia: CATALOGO.filter((p) => categoriaDe(p) === "advertencia").length,
  regulamentacao: CATALOGO.filter((p) => categoriaDe(p) === "regulamentacao").length,
  identificacao: CATALOGO.filter((p) => categoriaDe(p) === "identificacao").length,
  servicos: CATALOGO.filter((p) => categoriaDe(p) === "servicos").length,
  turisticas: CATALOGO.filter((p) => categoriaDe(p) === "turisticas").length,
  obras: CATALOGO.filter((p) => categoriaDe(p) === "obras").length,
};

export function categoriaDe(p: PlacaCatalogo): CategoriaPlaca | null {
  return p.category === "advertencia" ||
    p.category === "regulamentacao" ||
    p.category === "identificacao" ||
    p.category === "servicos" ||
    p.category === "turisticas" ||
    p.category === "obras"
    ? p.category
    : null;
}

/** Busca por nome/código ignora acento e caixa ("curva a" acha "Curva à"). */
export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Significado/dica escritos à mão para as placas-chave (estudo aprofundado). */
export function estudoDaPlaca(code?: string | null) {
  if (!code) return undefined;
  return PLACA_STUDY_DATA.find((s) => s.id === code);
}

/** Filtra o catálogo por categoria e por busca (nome ou código). */
export function filtrarPlacas(categoria: FiltroCategoria, busca: string): PlacaCatalogo[] {
  const termo = normalizar(busca.trim());
  return CATALOGO.filter((p) => {
    if (categoria !== "todas" && categoriaDe(p) !== categoria) return false;
    if (!termo) return true;
    return (
      normalizar(p.name ?? "").includes(termo) ||
      normalizar(p.code ?? "").includes(termo)
    );
  });
}

// ------------------------------------------------------------
// CHIP DE CATEGORIA (usado na página e no bloco do teórico)
// ------------------------------------------------------------
export function ChipCategoria({
  valor,
  ativo,
  onClick,
}: {
  valor: FiltroCategoria;
  ativo: boolean;
  onClick: () => void;
}) {
  const meta = valor === "todas" ? null : CATEGORIA_META[valor];
  const label = valor === "todas" ? "Todas as Placas" : meta!.label;
  const ativoClasses =
    valor === "todas"
      ? "bg-zinc-800 border-zinc-700 text-foreground"
      : meta!.chipAtivo;
  const hoverClasses = valor === "todas" ? "" : meta!.chipHover;

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
        ativo
          ? ativoClasses
          : `bg-secondary/20 border-border/20 text-muted-foreground ${hoverClasses}`
      }`}
    >
      {meta && <span className={`w-2 h-2 rounded-full ${meta.dot}`} />}
      {label} ({CONTAGENS[valor]})
    </button>
  );
}

// ------------------------------------------------------------
// GRADE DE PLACAS (cartões com imagem, código e nome)
// ------------------------------------------------------------
export function PlacaGrade({
  itens,
  onSelect,
}: {
  itens: PlacaCatalogo[];
  onSelect: (p: PlacaCatalogo) => void;
}) {
  if (itens.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-muted-foreground text-sm">
        Nenhuma placa encontrada.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
      {itens.map((p) => {
        const cat = categoriaDe(p);
        const glow = cat ? CATEGORIA_META[cat].glow : "";
        return (
          <button
            key={p.file ?? p.public_url ?? p.name}
            onClick={() => onSelect(p)}
            className={`rounded-2xl border border-border/30 bg-background/50 p-3 flex flex-col items-center gap-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-background/70 ${glow}`}
          >
            {/* Imagem real da placa (Supabase Storage) */}
            <div className="w-full aspect-square rounded-xl bg-white/95 flex items-center justify-center p-2.5">
              <img
                src={p.public_url ?? ""}
                alt={p.name ?? "Placa de trânsito"}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {/* Código oficial (pill) + nome */}
            {p.code && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary-glow">
                {p.code}
              </span>
            )}
            <p className="text-[11px] leading-snug font-semibold text-center text-foreground/90">
              {p.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------
// MODAL DE DETALHE (significado + dica de prova)
// ------------------------------------------------------------
export function PlacaDetalheModal({
  p,
  onClose,
}: {
  p: PlacaCatalogo | null;
  onClose: () => void;
}) {
  // Esc fecha o modal (como no site de referência)
  useEffect(() => {
    if (!p) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [p, onClose]);

  const estudo = p ? estudoDaPlaca(p.code) : undefined;
  const cat = p ? categoriaDe(p) : null;

  if (!p) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-3xl p-5 md:p-6 relative border border-zinc-800 bg-[#0C0F1A]"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagem à esquerda + significado à direita (como no site de referência) */}
        <div className="grid md:grid-cols-2 gap-5 items-start">
          <div className="rounded-2xl bg-white aspect-square flex items-center justify-center p-4 shadow-2xl">
            <img
              src={p.public_url ?? ""}
              alt={p.name ?? "Placa de trânsito"}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="space-y-3 text-left">
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary-glow">
              Placa de {cat ? CATEGORIA_META[cat].label : "trânsito"}
            </p>
            <h2 className="text-xl md:text-2xl font-display font-bold leading-tight">
              {p.code ? `${p.code} — ` : ""}
              {p.name}
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {estudo?.meaning ?? p.name}
            </p>

            {estudo?.tip && (
              <div className="space-y-1 bg-white/5 p-3 rounded-2xl border border-white/5">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Dica de prova
                </h4>
                <p className="text-xs text-foreground/90 leading-relaxed">{estudo.tip}</p>
              </div>
            )}

            {/* Fichas */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Categoria
                </p>
                <p className="text-xs font-semibold mt-0.5">
                  {cat ? CATEGORIA_META[cat].label : "Placa"}
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Código
                </p>
                <p className="text-xs font-semibold mt-0.5 font-mono">{p.code ?? "—"}</p>
              </div>
              {estudo?.legalBase && (
                <div className="col-span-2 rounded-xl border border-border/40 bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
                    <Info className="w-3 h-3" /> Base legal
                  </p>
                  <p className="text-xs font-semibold mt-0.5">{estudo.legalBase}</p>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold gradient-primary text-primary-foreground text-xs shadow-glow transition-all cursor-pointer"
            >
              Voltar ao catálogo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ------------------------------------------------------------
// PÁGINA /placas — catálogo completo (busca + todas as placas)
// ------------------------------------------------------------
export function PlacasCatalogo({ categoria }: { categoria: FiltroCategoria }) {
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<PlacaCatalogo | null>(null);

  const filtradas = useMemo(
    () => filtrarPlacas(categoria, busca),
    [categoria, busca],
  );

  return (
    <div>
      {/* Busca por nome ou código */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou código (ex: A-1a)"
          className="pl-10"
          aria-label="Buscar placa por nome ou código"
        />
      </div>

      <p className="text-[11px] text-muted-foreground mb-4">
        {filtradas.length} de {CATALOGO.length} placas
        {categoria !== "todas" &&
          ` · categoria ${CATEGORIA_META[categoria as CategoriaPlaca].label}`}
        {busca.trim() && ` · busca "${busca.trim()}"`}
      </p>

      <PlacaGrade itens={filtradas} onSelect={setSel} />

      <PlacaDetalheModal p={sel} onClose={() => setSel(null)} />
    </div>
  );
}

// ------------------------------------------------------------
// BLOCO DO TEÓRICO — "todas as placas ou por categoria"
// dentro da Parte Teórica, para o aluno estudar sem sair da tela.
// ------------------------------------------------------------
const LIMITE_INICIAL = 24;

export function PlacasEstudo({ className }: { className?: string }) {
  const [categoria, setCategoria] = useState<FiltroCategoria>("todas");
  const [busca, setBusca] = useState("");
  const [verTodas, setVerTodas] = useState(false);
  const [sel, setSel] = useState<PlacaCatalogo | null>(null);

  const filtradas = useMemo(
    () => filtrarPlacas(categoria, busca),
    [categoria, busca],
  );
  const visiveis = verTodas ? filtradas : filtradas.slice(0, LIMITE_INICIAL);
  const restam = filtradas.length - visiveis.length;

  // Ao trocar filtro/busca, volta para a lista curta
  useEffect(() => {
    setVerTodas(false);
  }, [categoria, busca]);

  return (
    <section id="secao-placas" className={cn("scroll-mt-24", className)}>
      <div className="glass rounded-3xl border border-border/40 p-5 md:p-6 space-y-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">
            Estudo de placas
          </p>
          <h2 className="text-xl md:text-2xl font-display font-bold mt-1">
            Todas as Placas de Trânsito e Seus Significados
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Busque, filtre por categoria e estude as {CATALOGO.length} placas de
            advertência, regulamentação e indicação com código e significado oficial.
          </p>
        </div>

        {/* Filtro por categoria (abas no mesmo formato do site de referência) */}
        <div className="flex gap-2 flex-wrap justify-center">
          <ChipCategoria
            valor="todas"
            ativo={categoria === "todas"}
            onClick={() => setCategoria("todas")}
          />
          <ChipCategoria
            valor="advertencia"
            ativo={categoria === "advertencia"}
            onClick={() => setCategoria("advertencia")}
          />
          <ChipCategoria
            valor="regulamentacao"
            ativo={categoria === "regulamentacao"}
            onClick={() => setCategoria("regulamentacao")}
          />
          <ChipCategoria
            valor="identificacao"
            ativo={categoria === "identificacao"}
            onClick={() => setCategoria("identificacao")}
          />
          <ChipCategoria
            valor="servicos"
            ativo={categoria === "servicos"}
            onClick={() => setCategoria("servicos")}
          />
          <ChipCategoria
            valor="turisticas"
            ativo={categoria === "turisticas"}
            onClick={() => setCategoria("turisticas")}
          />
          <ChipCategoria
            valor="obras"
            ativo={categoria === "obras"}
            onClick={() => setCategoria("obras")}
          />
        </div>

        {/* Busca por nome ou código */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou código (ex: A-1a)"
            className="pl-10"
            aria-label="Buscar placa por nome ou código"
          />
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          {filtradas.length} de {CATALOGO.length} placas
          {categoria !== "todas" &&
            ` · categoria ${CATEGORIA_META[categoria as CategoriaPlaca].label}`}
          {busca.trim() && ` · busca "${busca.trim()}"`}
        </p>

        <PlacaGrade itens={visiveis} onSelect={setSel} />

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {restam > 0 && (
            <ButtonOutline onClick={() => setVerTodas(true)}>
              Ver todas as {filtradas.length} placas
            </ButtonOutline>
          )}
          {verTodas && filtradas.length > LIMITE_INICIAL && (
            <ButtonOutline onClick={() => setVerTodas(false)}>
              Mostrar menos
            </ButtonOutline>
          )}
          <Link
            to="/placas"
            className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-4 py-2 text-[11px] font-bold text-primary-foreground shadow-glow hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Treinar no quiz das placas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <PlacaDetalheModal p={sel} onClose={() => setSel(null)} />
    </section>
  );
}

/** Botão discreto (mesmo estilo do app) para "ver todas" / "mostrar menos". */
function ButtonOutline({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-4 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
    >
      {children}
    </button>
  );
}
