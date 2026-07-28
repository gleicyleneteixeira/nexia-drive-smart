import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const RATED_KEY = "nexia:rating:rated"; // legado: marca que já enviou estrelas
const SESSION_SHOWN_KEY = "nexia:rating:sessionShown";
const SESSION_START_KEY = "nexia:rating:sessionStart";
const MIN_SESSION_MS = 1000 * 60; // 1 minuto na sessão antes do gatilho de troca de aba

function canPromptAuto(): boolean {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(SESSION_SHOWN_KEY) === "1") return false;
  return true;
}

function markShownThisSession() {
  try {
    window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
  } catch {}
}

export function triggerRatingPrompt(reason: "simulado-done" | "tab-visible" | "manual") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nexia:rating:trigger", { detail: { reason } }));
}

export function RatingPrompt() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [existingLoaded, setExistingLoaded] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const wasHidden = useRef<boolean>(false);

  // Marca início de sessão do usuário
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.sessionStorage.getItem(SESSION_START_KEY)) {
      window.sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }
  }, []);

  // Sincroniza "já avaliou" a partir do banco quando faz login
  useEffect(() => {
    if (!user) {
      setExistingLoaded(false);
      setHasExisting(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("app_ratings")
        .select("rating, comment")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        window.localStorage.setItem(RATED_KEY, "1");
        setHasExisting(true);
        setRating(data.rating ?? 0);
        setComment(data.comment ?? "");
      } else {
        window.localStorage.removeItem(RATED_KEY);
        setHasExisting(false);
        setRating(0);
        setComment("");
      }
      setExistingLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);



  // Gatilho por evento custom (fim de simulado, login, manual)
  useEffect(() => {
    function onTrigger(e: Event) {
      const detail = (e as CustomEvent).detail as { reason?: string } | undefined;
      const reason = detail?.reason ?? "manual";
      if (!user) return;
      if (reason === "manual") {
        setManual(true);
        setOpen(true);
        return;
      }
      if (!canPromptAuto()) return;
      setManual(false);
      setOpen(true);
      markShownThisSession();
    }
    window.addEventListener("nexia:rating:trigger", onTrigger as EventListener);
    return () => window.removeEventListener("nexia:rating:trigger", onTrigger as EventListener);
  }, [user]);

  function dismiss() {
    setOpen(false);
  }

  async function submit() {
    if (!user || rating < 1) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("app_ratings")
      .upsert(
        {
          user_id: user.id,
          rating,
          comment: comment.trim() ? comment.trim() : null,
        },
        { onConflict: "user_id" },
      );
    setSubmitting(false);
    if (error) {
      toast.error("Não foi possível salvar sua avaliação.");
      return;
    }
    window.localStorage.setItem(RATED_KEY, "1");
    setHasExisting(true);
    toast.success(hasExisting ? "Avaliação atualizada. Valeu!" : "Obrigado pela avaliação!");
  }

  if (!user) return null;

  const active = hover || rating;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-background/70 backdrop-blur-sm p-3"
          onClick={dismiss}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-3xl w-full max-w-md p-6 shadow-glow border border-border/50 relative max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold">
              {hasExisting ? "Atualize sua avaliação" : "Como está sua experiência?"}
            </p>
            <h2 className="text-xl font-display font-bold mt-1">
              {hasExisting ? "Mudou de ideia? Reavalie o app." : "Sua nota ajuda a melhorar o app."}
            </h2>

            <div className="flex justify-center gap-1.5 my-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                  aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-9 w-9 ${
                      n <= active
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            <label className="text-xs font-semibold text-muted-foreground">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="Conta pra gente o que você achou…"
              className="mt-1 w-full rounded-xl bg-background/50 border border-border p-3 text-sm resize-none focus:outline-none focus:border-primary/50"
            />

            <div className="mt-3 flex justify-end">
              <button
                onClick={submit}
                disabled={rating < 1 || submitting}
                className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {hasExisting ? "Atualizar avaliação" : "Enviar avaliação"}
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={dismiss}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}