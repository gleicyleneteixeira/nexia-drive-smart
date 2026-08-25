"use client";

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  buildPlanoFromConfig,
  buildScheduleItems,
  type PlanoEstudo,
  type ScheduleItem,
} from "@/components/CronogramaModal";
import { getReadingUrl } from "@/lib/heyzine";
import type { Database } from "@/integrations/supabase/types";

type EstudoConfigRow = Database["public"]["Tables"]["estudo_config"]["Row"];

interface UserProgress {
  current_session_index: number;
  last_access_date: string | null;
  completed_pages: number;
}

export function DailyCheckinBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<ScheduleItem[]>([]);
  const [pending, setPending] = React.useState<ScheduleItem | null>(null);
  const [progress, setProgress] = React.useState<UserProgress>({
    current_session_index: 1,
    last_access_date: null,
    completed_pages: 0,
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
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
        const plan: PlanoEstudo = buildPlanoFromConfig(config as EstudoConfigRow);
        const sched = buildScheduleItems(plan);
        if (cancelled) return;
        setItems(sched);

        let prog: UserProgress | null = null;
        try {
          const { data } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data) {
            prog = {
              current_session_index: data.current_session_index ?? 1,
              last_access_date: data.last_access_date ?? null,
              completed_pages: data.completed_pages ?? 0,
            };
          }
        } catch {
          prog = null;
        }

        if (!prog && !cancelled) {
          try {
            await supabase
              .from("user_progress")
              .upsert(
                { user_id: user.id, current_session_index: 1, completed_pages: 0, last_access_date: null },
                { onConflict: "user_id" }
              );
          } catch {
            /* tabela pode não existir ainda no banco */
          }
          prog = { current_session_index: 1, last_access_date: null, completed_pages: 0 };
        }

        if (cancelled) return;
        const p = prog as UserProgress;
        setProgress(p);
        const sess = sched[p.current_session_index - 1] ?? null;
        setPending(sess);
        setVisible(!!sess);
      } catch {
        /* silencioso: não bloqueia o app */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const persist = async (next: UserProgress) => {
    if (!user?.id) return;
    try {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          current_session_index: next.current_session_index,
          completed_pages: next.completed_pages,
          last_access_date: next.last_access_date,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch {
      toast.error("Não foi possível salvar seu progresso");
    }
  };

  const handleCompleteAndNext = () => {
    if (!pending) return;
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const next: UserProgress = {
      current_session_index: progress.current_session_index + 1,
      completed_pages: pending.paginaFim,
      last_access_date: today,
    };
    setProgress(next);
    const nextSess = items[next.current_session_index - 1] ?? null;
    setPending(nextSess);
    if (!nextSess) {
      setVisible(false);
      toast.success("Cronograma concluído! Parabéns! 🎉");
    } else {
      toast.success("Meta concluída! Bora para a próxima.");
    }
    void persist(next);
    setSaving(false);
  };

  const handleLerAgora = () => {
    if (!pending) return;
    const today = new Date().toISOString().split("T")[0];
    const next: UserProgress = { ...progress, last_access_date: today };
    setProgress(next);
    setVisible(false);
    window.open(getReadingUrl(pending.paginaInicio), "_blank");
    toast.success("Abra o livro e continue de onde parou! 📖");
    void persist(next);
  };

  const handleGoSimulado = () => {
    navigate({ to: "/simulado" });
  };

  if (!visible || !pending || loading) return null;

  return (
    <div className="relative bg-slate-900 border-b border-slate-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0 pr-8">
          <p className="text-sm font-semibold text-blue-400">👋 Que bom te ver de volta!</p>
          <p className="text-xs text-slate-300 mt-0.5">
            Sua meta pendente:{" "}
            <strong className="text-white">
              {pending.capitulo} — Páginas {pending.paginaInicio} a {pending.paginaFim} (Capítulo {pending.capituloId || "—"})
            </strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            type="button"
            onClick={handleCompleteAndNext}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Já li e quero a próxima
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleLerAgora}
            disabled={saving}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4 mr-1.5" /> Ler Agora
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoSimulado}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Ir p/ Simulado
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Fechar"
          className="absolute right-3 top-3 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
