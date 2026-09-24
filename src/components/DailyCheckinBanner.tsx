"use client";

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, FileText, AlertTriangle, CalendarClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { buildPlanoFromConfig, type PlanoEstudo } from "@/components/CronogramaModal";
import {
  gerarCronograma,
  classificarLeitura,
  primeiraPendente,
  END_PAGE,
  type CronogramaGerado,
  type ScheduleItem,
} from "@/lib/schedule";
import { getReadingUrl } from "@/lib/heyzine";
import type { Category } from "@/data/questions";
import type { Database } from "@/integrations/supabase/types";

type EstudoConfigRow = Database["public"]["Tables"]["estudo_config"]["Row"];

interface UserProgress {
  current_session_index: number;
  last_access_date: string | null;
  completed_pages: number;
}

function mapChapterToCategory(capituloId: number): Category | null {
  const map: Record<number, Category> = {
    1: "legislacao",
    2: "direcao-defensiva",
    3: "primeiros-socorros",
    4: "meio-ambiente",
    5: "mecanica",
  };
  return map[capituloId] ?? null;
}

function isoHoje(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatarDataBR(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function DailyCheckinBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [crono, setCrono] = React.useState<CronogramaGerado | null>(null);
  const [plano, setPlano] = React.useState<PlanoEstudo | null>(null);
  const [pending, setPending] = React.useState<ScheduleItem | null>(null);
  const [hasCronograma, setHasCronograma] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [partialOpen, setPartialOpen] = React.useState(false);
  const [partialPage, setPartialPage] = React.useState("");
  const [partialChoice, setPartialChoice] = React.useState<"full" | "partial">("full");
  const [progress, setProgress] = React.useState<UserProgress>({
    current_session_index: 1,
    last_access_date: null,
    completed_pages: 0,
  });
  const [saving, setSaving] = React.useState(false);
  // Guarda o cronograma anterior durante um informe, p/ classificar o resultado.
  const cronoRef = React.useRef<CronogramaGerado | null>(null);

  // Recarrega quando o cronograma é criado/editado/excluído em outro componente
  React.useEffect(() => {
    const handler = () => setReloadKey((k) => k + 1);
    window.addEventListener("nexia:cronograma:change", handler);
    return () => window.removeEventListener("nexia:cronograma:change", handler);
  }, []);

  React.useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      // Zera o estado anterior (importante após editar/excluir o cronograma)
      setHasCronograma(false);
      setPending(null);
      setCrono(null);
      try {
        const { data: config } = await supabase
          .from("estudo_config")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!config) {
          if (!cancelled) setLoading(false);
          return;
        }
        if (!cancelled) setHasCronograma(true);
        const plan: PlanoEstudo = buildPlanoFromConfig(config as EstudoConfigRow);

        // Progresso: localStorage é a fonte primária neste navegador;
        // fallback para profiles.studies (progresso entre dispositivos).
        // Obs.: estudo_config não possui colunas de progresso no banco real.
        let completed = 0;
        let lastAccess: string | null = null;
        let temLocal = false;
        try {
          const raw = localStorage.getItem(`cronograma_progress_${user.id}`);
          if (raw) {
            const lp = JSON.parse(raw);
            if (typeof lp.completed_pages === "number") {
              completed = lp.completed_pages;
              lastAccess = lp.last_access_date ?? null;
              temLocal = true;
            }
          }
        } catch {
          /* localStorage indisponível */
        }
        if (!temLocal) {
          try {
            const { data: prof } = await supabase
              .from("profiles")
              .select("studies")
              .eq("id", user.id)
              .maybeSingle();
            const rp = (prof as any)?.studies?.reading_progress;
            if (rp && typeof rp.completed_pages === "number") {
              completed = rp.completed_pages;
              lastAccess = rp.last_access_date ?? null;
            }
          } catch {
            /* profiles indisponível — silencioso */
          }
        }

        if (cancelled) return;

        // Projeção adaptativa do cronograma a partir do progresso atual.
        const leuHoje = lastAccess === isoHoje();
        const c = gerarCronograma({
          progresso: completed,
          selectedDays: plan.selectedDays,
          blockPages: plan.calculatedPages,
          examDate: plan.semData ? null : plan.dataProva,
          leuHoje,
        });
        const pend = primeiraPendente(c.blocos);
        const p: UserProgress = {
          current_session_index: pend ? pend.dia : c.blocos.length,
          last_access_date: lastAccess,
          completed_pages: completed,
        };
        setPlano(plan);
        setCrono(c);
        cronoRef.current = c;
        setProgress(p);
        setPending(pend);
      } catch {
        /* silencioso: não bloqueia o app */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, reloadKey]);

  const persist = async (next: UserProgress) => {
    if (!user?.id) return;
    // 1. Garantido: localStorage (fonte primária neste navegador)
    try {
      localStorage.setItem(
        `cronograma_progress_${user.id}`,
        JSON.stringify({
          current_session_index: next.current_session_index,
          completed_pages: next.completed_pages,
          last_access_date: next.last_access_date,
          updated_at: new Date().toISOString(),
        })
      );
    } catch {
      toast.warning("Não foi possível guardar o progresso neste navegador", {
        description: "Seu navegador pode estar em modo privado.",
      });
    }
    // 2. Best-effort: profiles.studies (progresso entre dispositivos).
    // Escrita silenciosa: se RLS ou linha ausente bloquearem, o localStorage
    // acima já garantiu o progresso.
    try {
      const { data: prof } = await supabase
        .from("profiles")
        .select("studies")
        .eq("id", user.id)
        .maybeSingle();
      const estudos: any =
        prof?.studies && typeof prof.studies === "object" && !Array.isArray(prof.studies)
          ? prof.studies
          : {};
      await supabase
        .from("profiles")
        .update({
          studies: {
            ...estudos,
            reading_progress: {
              current_session_index: next.current_session_index,
              completed_pages: next.completed_pages,
              last_access_date: next.last_access_date,
              updated_at: new Date().toISOString(),
            },
          },
        })
        .eq("id", user.id);
    } catch {
      /* silencioso: localStorage já garantiu o progresso */
    }
  };

  /**
   * FLUXO ÚNICO de informe de leitura (tanto "Li tudo" quanto "Li parcialmente").
   *
   * `informedPage` pode ir até END_PAGE (adiantamento permitido) — a única
   * restrição é ser maior que o progresso atual.
   */
  const reportarLeitura = async (informedPage: number) => {
    if (!plano || saving) return;
    const minPage = progress.completed_pages + 1;
    if (!Number.isInteger(informedPage) || informedPage < minPage || informedPage > END_PAGE) {
      toast.error(`Informe uma página entre ${minPage} e ${END_PAGE}.`);
      return;
    }

    setSaving(true);
    try {
      const old = cronoRef.current;
      const fimMetaAnterior = pending ? pending.paginaFim : informedPage;

      // 1. Gera o novo cronograma projetado (mono: só avança)
      const novo = gerarCronograma({
        progresso: informedPage,
        selectedDays: plano.selectedDays,
        blockPages: plano.calculatedPages,
        examDate: plano.semData ? null : plano.dataProva,
        leuHoje: true,
      });

      // 2. Classifica ANTES de substituir (usa old vs novo)
      const { tipo, diasGanhos } = classificarLeitura({
        informado: informedPage,
        fimMetaAnterior,
        dataFinalAntes: old?.dataFinal ?? null,
        dataFinalDepois: novo.dataFinal,
      });

      // 3. Persiste (fonte da verdade)
      const today = isoHoje();
      const next: UserProgress = {
        current_session_index: primeiraPendente(novo.blocos)?.dia ?? novo.blocos.length,
        last_access_date: today,
        completed_pages: informedPage,
      };
      await persist(next);

      // 4. Atualiza estado local
      const pend = primeiraPendente(novo.blocos);
      setProgress(next);
      setCrono(novo);
      cronoRef.current = novo;
      setPending(pend);
      setPartialOpen(false);

      // 5. Feedback diferenciado
      if (tipo === "CRONOGRAMA_CONCLUIDO") {
        toast.success("Cronograma concluído! Parabéns! 🎉");
      } else if (tipo === "ADIANTADO") {
        toast.success(`Você avançou ${diasGanhos} ${diasGanhos === 1 ? "dia" : "dias"}! 🎉`, {
          description: "Seu cronograma foi encurtado — continue assim!",
          duration: 6000,
        });
      } else if (tipo === "REAGENDADO") {
        const proxData = pend?.data ? formatarDataBR(pend.data) : "";
        toast.success(`Progresso salvo: leu até a página ${informedPage}. 📖`, {
          description: proxData
            ? `Suas próximas metas foram reagendadas — nova meta em ${proxData}.`
            : "Suas próximas metas foram reagendadas.",
        });
      } else {
        toast.success("Meta concluída! Bora para a próxima.");
      }

      if (novo.ajustado && !old?.ajustado) {
        toast.info(`Ritmo ajustado para ${novo.blocoUsado} páginas/dia`, {
          description: "Ajuste automático para chegar antes da prova.",
          duration: 5000,
        });
      }
      if (novo.risco && !old?.risco) {
        toast.warning("⚠️ Prazo apertado para a prova", {
          description: "Ajuste seus dias ou ritmo no botão “Ajustar cronograma”.",
          duration: 8000,
        });
      }
    } catch {
      toast.error("Não foi possível salvar seu progresso");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteAndNext = () => {
    if (!pending) return;
    void reportarLeitura(pending.paginaFim);
  };

  const handleSavePartial = () => {
    const page = Number(partialPage);
    if (!Number.isInteger(page)) {
      toast.error("Informe uma página válida.");
      return;
    }
    void reportarLeitura(page);
  };

  const handleLerAgora = () => {
    if (!pending) return;
    // Abre na primeira página ainda não lida da meta atual
    const startPage = Math.max(pending.paginaInicio, progress.completed_pages + 1);
    window.open(getReadingUrl(startPage), "_blank");
    toast.success("Abra o livro e continue de onde parou! 📖");
  };

  const handleGoSimulado = () => {
    // Cronograma INTENSIVO (poucos dias de estudo): vai para o Simulado Geral (30 questões).
    // Cronograma REGULAR: vai para o Simulado por categoria do capítulo da meta pendente.
    const isIntensivo = (plano?.studyDaysNeeded ?? 999) <= 3;
    if (isIntensivo) {
      navigate({ to: "/simulado", search: { modo: "completo", categoria: undefined } });
      return;
    }
    const category = pending ? mapChapterToCategory(pending.capituloId) : null;
    if (category) {
      navigate({ to: "/simulado", search: { modo: undefined, categoria: category } });
    } else {
      navigate({ to: "/simulado", search: { modo: "completo", categoria: undefined } });
    }
  };

  const handleAjustarCronograma = () => {
    window.dispatchEvent(new CustomEvent("nexia:abrir-cronograma"));
  };

  if (!hasCronograma || loading) return null;

  // Páginas restantes da meta atual (considera leitura parcial já registrada)
  const partialRead =
    pending != null &&
    progress.completed_pages >= pending.paginaInicio &&
    progress.completed_pages < pending.paginaFim;
  const startPage = pending
    ? Math.max(pending.paginaInicio, progress.completed_pages + 1)
    : 0;

  if (!pending) {
    return (
      <div className="relative bg-green-500/20 border-b border-green-500/30 text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-400">🎉 Cronograma concluído!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Você completou todas as metas de hoje. Parabéns!
            </p>
          </div>
          <Button
            type="button"
            onClick={handleGoSimulado}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Ir p/ Simulado
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-card border-b border-border text-foreground">
      {crono?.risco && (
        <div className="bg-red-500/15 border-b border-red-500/30">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1 flex items-center gap-2 text-red-400 text-xs font-medium">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Prazo apertado: não há como terminar a leitura antes da prova com o ritmo atual.
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAjustarCronograma}
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 shrink-0"
            >
              <CalendarClock className="h-3.5 w-3.5 mr-1" /> Ajustar cronograma
            </Button>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary">👋 Que bom te ver de volta!</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sua meta pendente:{" "}
            <strong className="text-foreground">
              {pending.capitulo} — Páginas {startPage} a {pending.paginaFim} (Capítulo {pending.capituloId || "—"})
            </strong>
            {pending.data && (
              <span className="text-muted-foreground"> · {formatarDataBR(pending.data)}</span>
            )}
            {partialRead && (
              <span className="text-amber-400"> · você já leu até a página {progress.completed_pages}</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleLerAgora}
            disabled={saving}
            className="border-border text-foreground hover:bg-accent"
          >
            <BookOpen className="h-4 w-4 mr-1.5" /> Ler Agora
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoSimulado}
            className="border-border text-foreground hover:bg-accent"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Ir p/ Simulado
          </Button>
          <Button
            type="button"
            onClick={() => {
              // Popup de confirmação: a pessoa escolhe entre lição completa
              // ou leitura parcial (ajustando a página lida).
              setPartialChoice("full");
              setPartialPage(pending ? String(pending.paginaFim) : "");
              setPartialOpen(true);
            }}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Já completei essa lição
          </Button>
        </div>
      </div>
      {pending && (
        <Dialog open={partialOpen} onOpenChange={setPartialOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Como foi sua leitura?</DialogTitle>
              <DialogDescription>
                Meta: páginas {pending.paginaInicio} a {pending.paginaFim} ({pending.capitulo}).
                Selecione o que você conseguiu ler.
              </DialogDescription>
            </DialogHeader>

            {partialChoice === "full" ? (
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setPartialOpen(false);
                    handleCompleteAndNext();
                  }}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white w-full"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Li tudo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPartialChoice("partial");
                    setPartialPage(
                      partialRead ? String(progress.completed_pages) : ""
                    );
                  }}
                  disabled={saving}
                  className="border-border text-foreground hover:bg-accent w-full"
                >
                  Li parcialmente
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Li até a página</span>
                  <input
                    type="number"
                    value={partialPage}
                    onChange={(e) => setPartialPage(e.target.value)}
                    min={progress.completed_pages + 1}
                    max={END_PAGE}
                    placeholder={`${progress.completed_pages + 1}–${END_PAGE}`}
                    autoFocus
                    className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    (até a {END_PAGE} — pode ler adiante!)
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setPartialChoice("full")}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSavePartial}
                    disabled={saving}
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Salvar progresso
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
