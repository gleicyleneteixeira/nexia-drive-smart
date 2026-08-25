import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchLibraryItem, type LibraryItem } from "@/lib/library";
import { ArrowLeft, ExternalLink, Loader2, Lock, Volume2, VolumeX, ArrowRight, BookOpen } from "lucide-react";
import { PdfFlipbook } from "@/components/PdfFlipbook";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/biblioteca/$id")({
  component: ItemViewer,
});

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.35 },
      scale: { duration: 0.35 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  }),
};

function playSwoosh() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch {}
}

function ItemViewer() {
  const { id } = Route.useParams();
  const { data: item, isLoading } = useQuery({
    queryKey: ["library", id],
    queryFn: () => fetchLibraryItem(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Carregando...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Item não encontrado.</p>
        <Link to="/biblioteca" className="text-primary mt-4 inline-block">
          ← Voltar para biblioteca
        </Link>
      </div>
    );
  }

  if (item.is_paid) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="glass rounded-3xl p-8 text-center">
          <Lock className="h-12 w-12 mx-auto text-warning mb-3" />
          <h1 className="text-xl font-display font-bold mb-2">{item.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Conteúdo premium por R$ {((item.price_cents ?? 0) / 100).toFixed(2)}
          </p>
          <Button disabled className="w-full">Em breve — pagamento</Button>
          <Link to="/biblioteca" className="text-xs text-muted-foreground mt-4 inline-block">
            ← Voltar
          </Link>
        </div>
      </div>
    );
  }

  // Unified visualizer slides for carousels and narrated images
  const slides = item.item_type === "carousel"
    ? (Array.isArray(item.slides) ? item.slides : [])
    : (item.item_type === "image" && item.narrated)
    ? [{ image_url: item.url, text: item.description ?? "" }]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link to="/biblioteca" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Biblioteca
        </Link>
        <h1 className="font-display font-bold text-lg truncate max-w-[250px] md:max-w-md">{item.title}</h1>
        <div className="w-20" />
      </div>

      {/* Render Carousel or Narrated Image */}
      {slides.length > 0 ? (
        <LibraryCarouselViewer item={item} slides={slides} />
      ) : (
        <>
          {item.item_type === "pdf" && <PdfFlipbook url={item.url} />}

          {item.item_type === "heyzine" && (
            <div className="w-full aspect-[4/3] md:aspect-video glass rounded-2xl overflow-hidden">
              <iframe src={item.url} className="w-full h-full" allowFullScreen title={item.title} />
            </div>
          )}

          {item.item_type === "link" && (
            <div className="glass rounded-3xl p-8 text-center max-w-md mx-auto">
              <ExternalLink className="h-12 w-12 mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                {item.description ?? "Conteúdo externo"}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
              >
                Abrir site <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LibraryCarouselViewer({
  item,
  slides,
}: {
  item: LibraryItem;
  slides: any[];
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const slide = slides[current];

  const organizeSlideText = (text: string): string => {
    if (!text) return "";
    const lines = text.split("\n").filter((line) => line.trim());
    const leftCol: string[] = [];
    const rightCol: string[] = [];
    let currentCol: "left" | "right" = "left";

    for (const line of lines) {
      if (/^[A-Z]-\d+/.test(line.trim())) {
        if (currentCol === "left") currentCol = "right";
        else leftCol.push(line);
      } else {
        if (currentCol === "left") leftCol.push(line);
        else rightCol.push(line);
      }
    }

    return [...leftCol, ...rightCol].join(" ");
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(organizeSlideText(text));
      u.lang = "pt-BR";
      u.rate = 1.05;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const stopAllAudio = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  };

  useEffect(() => {
    stopAllAudio();
    if (isMuted || !item.narrated || !slide || !slide.text) return;

    const timer = setTimeout(() => {
      speakText(slide.text);
    }, 150);

    return () => {
      clearTimeout(timer);
      stopAllAudio();
    };
  }, [current, isMuted, item.narrated, slide]);

  useEffect(() => {
    return () => stopAllAudio();
  }, []);

  const handleNext = () => {
    if (current < slides.length - 1) {
      playSwoosh();
      setDirection(1);
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      playSwoosh();
      setDirection(-1);
      setCurrent(current - 1);
    }
  };

  const isSingle = slides.length === 1;

  return (
    <div className="w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-glow flex flex-col bg-background/30 border border-border/20">
      {/* Top Bar with mute toggle */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/10 bg-black/20">
        <span className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {item.item_type === "carousel" ? "Carrossel de Dicas" : "Imagem Narrada"}
        </span>
        {item.narrated && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-3 py-1.5 rounded-xl glass text-xs font-semibold text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-destructive-glow" />
                <span>🔇 Mudo</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-primary-glow" />
                <span>🔊 Ouvir Narração</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Slide Panel */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col animate-once"
          >
            <div className="w-full h-full relative overflow-hidden">
              <motion.img
                key={slide.image_url}
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                src={slide.image_url}
                alt={slide.text}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              
              {!isSingle && (
                <div className="absolute bottom-4 left-6 text-xs text-white/70 font-semibold bg-black/40 px-2 py-1 rounded">
                  Slide {current + 1} de {slides.length}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Text Panel */}
      <div className="px-6 py-6 flex-1 flex flex-col justify-between space-y-6 min-h-[140px] bg-black/10">
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-left">
          {organizeSlideText(slide.text)}
        </p>

        {/* Footer controls */}
        {!isSingle && (
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/10">
            {/* Navigation dots */}
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playSwoosh();
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    i === current
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {current > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl glass text-xs font-semibold hover:bg-accent/20 transition-all text-white/80 cursor-pointer"
                >
                  Anterior
                </button>
              )}
              
              {current < slides.length - 1 && (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold shadow-glow hover:shadow-glow flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Próximo <ArrowRight className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
