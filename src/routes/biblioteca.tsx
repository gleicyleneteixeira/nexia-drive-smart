import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLibraryItems, type LibraryItem } from "@/lib/library";
import { Book, ExternalLink, Lock, FileText, BookOpen, Loader2, Play, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/biblioteca")({
  component: BibliotecaPage,
  head: () => ({
    meta: [
      { title: "Biblioteca — Nexia DETRAN" },
      { name: "description", content: "Livros, apostilas e materiais complementares para sua prova do DETRAN." },
    ],
  }),
});

function BibliotecaPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["library", "published"],
    queryFn: () => fetchLibraryItems(false),
  });

  const [moduleTab, setModuleTab] = useState<"all" | "teorico" | "psicotecnico" | "direcao">("all");
  const [typeTab, setTypeTab] = useState<"all" | "livros" | "videos" | "images" | "docs">("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get("module_type") || params.get("category");
      if (mod === "teorico" || mod === "psicotecnico" || mod === "direcao") {
        setModuleTab(mod);
      }
    }
  }, []);

  const items = (data ?? []).filter((i) => {
    if (moduleTab !== "all" && i.module_type !== moduleTab) return false;
    if (typeTab === "livros") return i.item_type === "pdf" || i.item_type === "heyzine";
    if (typeTab === "videos") return i.item_type === "video";
    if (typeTab === "images") return i.item_type === "image" || i.item_type === "carousel";
    if (typeTab === "docs") return i.item_type === "link";
    return true;
  });
  const free = items.filter((i) => !i.is_paid);
  const paid = items.filter((i) => i.is_paid);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary-glow font-semibold">Biblioteca</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold mt-2">
            Estude com <span className="gradient-text">livros e materiais</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
            Livrinhos virtuais, apostilas, vídeos e conteúdo premium pra turbinar sua aprovação.
          </p>
        </div>

        {/* Module Tabs */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-1.5 p-1 rounded-xl bg-background/50 border border-border/20 self-start shrink-0">
            <button
              onClick={() => setModuleTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                moduleTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tudo
            </button>
            <button
              onClick={() => setModuleTab("teorico")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                moduleTab === "teorico"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>📘</span> Teórico
            </button>
            <button
              onClick={() => setModuleTab("psicotecnico")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                moduleTab === "psicotecnico"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🧠</span> Psico
            </button>
            <button
              onClick={() => setModuleTab("direcao")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                moduleTab === "direcao"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🚗</span> Direção
            </button>
          </div>

          {/* Type Tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-background/50 border border-border/20 self-start shrink-0">
            <button
              onClick={() => setTypeTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeTab === "all"
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeTab("livros")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                typeTab === "livros"
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3 w-3" /> Livros
            </button>
            <button
              onClick={() => setTypeTab("videos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                typeTab === "videos"
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Play className="h-3 w-3" /> Vídeos
            </button>
            <button
              onClick={() => setTypeTab("images")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                typeTab === "images"
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-3 w-3" /> Imagens
            </button>
            <button
              onClick={() => setTypeTab("docs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                typeTab === "docs"
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3 w-3" /> Docs
            </button>
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Carregando...
        </div>
      )}
      {error && <p className="text-destructive">Erro ao carregar biblioteca.</p>}

      {!isLoading && items.length === 0 && (
        <div className="glass rounded-3xl p-12 text-center">
          <Book className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum item disponível ainda.</p>
        </div>
      )}

      {free.length > 0 && (
        <Section title="Conteúdo gratuito" items={free} />
      )}
      {paid.length > 0 && (
        <Section title="Conteúdo premium" items={paid} />
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: LibraryItem[] }) {
  return (
    <section>
      <h2 className="text-xl font-display font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
          >
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ItemCard({ item }: { item: LibraryItem }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const isVideo = item.item_type === "video";
  const isImage = item.item_type === "image";
  const isCarousel = item.item_type === "carousel";
  const Icon = isCarousel ? BookOpen : isImage ? ImageIcon : isVideo ? Play : item.item_type === "pdf" ? BookOpen : item.item_type === "heyzine" ? FileText : ExternalLink;
  const typeLabel = isCarousel ? "Carrossel" : isImage ? "Imagem" : isVideo ? "Vídeo" : item.item_type === "pdf" ? "Livrinho" : item.item_type === "heyzine" ? "Flipbook" : "Link";

  const href = (isImage && !item.narrated) ? undefined : isVideo || item.item_type === "heyzine" ? item.url : (item.is_paid ? undefined : `/biblioteca/${item.id}`);
  const target = isVideo || item.item_type === "heyzine" ? "_blank" : undefined;
  const rel = isVideo || item.item_type === "heyzine" ? "noreferrer" : undefined;

  const handleClick = (e: React.MouseEvent) => {
    if (isImage && !item.narrated) {
      e.preventDefault();
      setShowLightbox(true);
      return;
    }
    if (item.is_paid && item.item_type !== "heyzine" && !isVideo) {
      e.preventDefault();
      alert("Conteúdo premium — em breve disponível para compra.");
    }
  };

  return (
    <>
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
        className="group block glass rounded-2xl overflow-hidden hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow h-full cursor-pointer"
      >
        <div className="aspect-[4/3] relative bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
          {item.cover_url ? (
            <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className="h-16 w-16 text-primary/50" />
            </div>
          )}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
              </div>
            </div>
          )}
          {isImage && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
          {item.is_paid && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-warning/90 text-warning-foreground text-xs font-bold flex items-center gap-1">
              <Lock className="h-3 w-3" />
              R$ {((item.price_cents ?? 0) / 100).toFixed(2)}
            </div>
          )}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg glass text-xs font-medium">
            {typeLabel}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold leading-tight">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>
      </a>

      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={item.url || item.cover_url || ""}
                alt={item.title}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="mt-3 text-center">
                <h3 className="font-semibold text-white">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-white/70 mt-1">{item.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
