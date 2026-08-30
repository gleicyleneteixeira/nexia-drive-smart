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
  const [motivo, setMotivo] = useState("");
  const [sugestao, setSugestao] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [existingLoaded, setExistingLoaded] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const wasHidden = useRef<boolean>(false);

  const isRatingLow = rating > 0 && rating < 5;
  const isMotivoValido = motivo.trim().length >= 15;
  const isSugestaoValida = sugestao.trim().length >= 15;
  const canSubmit = rating === 5 || (isRatingLow && isMotivoValido && isSugestaoValida);

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
    if (!user || rating < 1 || !canSubmit) return;
    setSubmitting(true);
    let finalComment: string | null = null;
    if (isRatingLow) {
      finalComment = `Não agradou: ${motivo.trim()}\nSugestão: ${sugestao.trim()}`;
    } else if (comment.trim()) {
      finalComment = comment.trim();
    }
    const { error } = await supabase
      .from("app_ratings")
      .upsert(
        {
          user_id: user.id,
          rating,
          comment: finalComment,
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
    dismiss();
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

            {isRatingLow ? (
              <div className="space-y-4 text-left mt-1">
                <p className="text-xs text-warning font-semibold text-center">
                  ⚠️ Para notas abaixo de 5, detalhe sua experiência para nos ajudar a melhorar.
                </p>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    O que não agradou no simulado? * (mínimo 15 caracteres)
                  </label>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value.slice(0, 300))}
                    maxLength={300}
                    placeholder="Conte detalhadamente o que você achou ruim..."
                    className="w-full p-3 bg-background/50 border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:border-primary/50"
                  />
                  <div className="text-right text-[10px] text-muted-foreground">
                    {motivo.length}/300 (mínimo: 15)
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    Qual a sua sugestão de melhoria? * (mínimo 15 caracteres)
                  </label>
                  <textarea
                    value={sugestao}
                    onChange={(e) => setSugestao(e.target.value.slice(0, 300))}
                    maxLength={300}
                    placeholder="O que poderíamos fazer para tornar o teste melhor?"
                    className="w-full p-3 bg-background/50 border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:border-primary/50"
                  />
                  <div className="text-right text-[10px] text-muted-foreground">
                    {sugestao.length}/300 (mínimo: 15)
                  </div>
                </div>
              </div>
            ) : (
              <div>
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
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-6">
              <button
                onClick={dismiss}
                disabled={submitting}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition disabled:opacity-50"
              >
                Pular Avaliação
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit || submitting}
                className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {hasExisting ? "Atualizar avaliação" : "Enviar avaliação"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}