"use client";

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, FileText, AlertTriangle, CalendarClock, Headphones } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { NativePdfModal } from "@/components/NativePdfModal";
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
import { fetchCronogramaBook, type LibraryItem } from "@/lib/library";
import { CATEGORY_LABELS, type Category } from "@/data/questions";
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
  // Oferta de simulado após concluir a lição (categoria da lição concluída)
  const [quizOffer, setQuizOffer] = React.useState<{ category: Category | null } | null>(null);
  // Livrinho do cronograma vinculado no admin (botão Ouvir) + modal de audição
  const [livro, setLivro] = React.useState<LibraryItem | null>(null);
  const [pdfModal, setPdfModal] = React.useState<{ url: string; title: string; page: number } | null>(null);
  // Guarda o cronograma anterior durante um informe, p/ classificar o resultado.
  const cronoRef = React.useRef<CronogramaGerado | null>(null);

  // Recarrega quando o cronograma é criado/editado/excluído em outro componente
  React.useEffect(() => {
    const handler = () => setReloadKey((k) => k + 1);
    window.addEventListener("nexia:cronograma:change", handler);
    return () => window.removeEventListener("nexia:cronograma:change", handler);
  }, []);

  // Lembrete de estudo no WhatsApp: tem meta pendente e ainda não leu hoje.
  // 1x ao dia; o servidor só envia se o template estiver ligado.
  React.useEffect(() => {
    if (!user?.id || !pending || saving) return;
    const hoje = isoHoje();
    if (progress.last_access_date === hoje) return;
    const key = `wa_reminder_${user.id}_${hoje}`;
    try {
      if (localStorage.getItem(key)) return;
    } catch {
      return;
    }
    (async () => {
      try {
        const { triggerWaNotification } = await import("@/lib/admin-operations.server");
        const r = await triggerWaNotification({ data: { template: "reminder" } });
        if (r?.sent) {
          try {
            localStorage.setItem(key, "1");
          } catch {
            /* sem localStorage */
          }
        }
      } catch {
        /* silencioso */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, pending]);

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

        // Livrinho vinculado no admin (botão Ouvir) — em paralelo, sem bloquear
        fetchCronogramaBook()
          .then((book) => {
            if (!cancelled) setLivro(book && book.published ? book : null);
          })
          .catch(() => {
            /* sem livrinho: esconde o botão Ouvir */
          });

        // Progresso: localStorage é a fonte única (estudo_config não tem
        // colunas de progresso e a tabela user_progress não existe no banco).
        let completed = 0;
        let lastAccess: string | null = null;
        try {
          const raw = localStorage.getItem(`cronograma_progress_${user.id}`);
          if (raw) {
            const lp = JSON.parse(raw);
            if (typeof lp.completed_pages === "number") {
              completed = lp.completed_pages;
              lastAccess = lp.last_access_date ?? null;
            }
          }
        } catch {
          /* localStorage indisponível */
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
    // localStorage: fonte única do progresso de leitura (o banco não possui
    // tabela/coluna de progresso — estudo_config só guarda a CONFIGURAÇÃO).
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

      // Concluiu a lição (chegou ao fim da meta ou leu adiante): oferece o
      // simulado da categoria — "Parabéns, vamos testar seu conhecimento".
      // Usa o pending ANTIGO (a lição recém-concluída), não a nova meta.
      const completouLicao = informedPage >= fimMetaAnterior;
      if (completouLicao) {
        const isIntensivo = (plano?.studyDaysNeeded ?? 999) <= 3;
        const category = !isIntensivo && pending ? mapChapterToCategory(pending.capituloId) : null;
        setQuizOffer({ category });
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

  const handleOuvir = () => {
    if (!pending || !livro) return;
    // Abre o livrinho vinculado DIRETO na página da meta e tenta narrar
    const startPage = Math.max(pending.paginaInicio, progress.completed_pages + 1);
    setPdfModal({ url: livro.url, title: livro.title, page: startPage });
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

  const handleQuizOfferGo = () => {
    if (!quizOffer) return;
    // Destino guardado na hora da conclusão (categoria da lição concluída).
    const isIntensivo = (plano?.studyDaysNeeded ?? 999) <= 3;
    if (isIntensivo || !quizOffer.category) {
      navigate({ to: "/simulado", search: { modo: "completo", categoria: undefined } });
    } else {
      navigate({ to: "/simulado", search: { modo: undefined, categoria: quizOffer.category } });
    }
    setQuizOffer(null);
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
          {livro && (
            <Button
              type="button"
              variant="outline"
              onClick={handleOuvir}
              disabled={saving}
              className="border-border text-foreground hover:bg-accent"
            >
              <Headphones className="h-4 w-4 mr-1.5" /> Ouvir
            </Button>
          )}
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
      {/* Parabéns + convite ao simulado da categoria recém-concluída */}
      <Dialog open={quizOffer !== null} onOpenChange={(o) => { if (!o) setQuizOffer(null); }}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Parabéns! 🎉</DialogTitle>
            <DialogDescription>
              Lição concluída! Vamos testar seu conhecimento
              {quizOffer?.category ? (
                <> de <strong className="text-foreground">{CATEGORY_LABELS[quizOffer.category]}</strong></>
              ) : (
                " geral"
              )}
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={handleQuizOfferGo}
              className="bg-emerald-600 hover:bg-emerald-500 text-white w-full"
            >
              <FileText className="h-4 w-4 mr-1.5" /> Fazer simulado agora
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setQuizOffer(null)}
              className="w-full"
            >
              Agora não
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {pdfModal && (
        <NativePdfModal
          pdfUrl={pdfModal.url}
          title={pdfModal.title}
          initialPage={pdfModal.page}
          autoStart
          onClose={() => setPdfModal(null)}
        />
      )}
    </div>
  );
}
