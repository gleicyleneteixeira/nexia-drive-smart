"use client";

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CronogramaDia {
  id: string;
  dia_numero: number;
  data_agendada: string;
  paginas_leitura: string;
  qtd_simulados_meta: number;
  concluido: boolean;
}

export const DashboardDiario = () => {
  const { user } = useAuth();
  const [cronogramaHoje, setCronogramaHoje] = React.useState<CronogramaDia | null>(null);
  const [loading, setLoading] = React.useState(true);

  const today = new Date().toISOString().split("T")[0];

  React.useEffect(() => {
    (async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("cronograma_dias")
        .select("*")
        .eq("user_id", user.id)
        .eq("data_agendada", today)
        .maybeSingle();

      if (!error && data) {
        setCronogramaHoje(data as CronogramaDia);
      }
      setLoading(false);
    })();
  }, [user?.id, today]);

  if (loading) {
    return null;
  }

  if (!cronogramaHoje) {
    return null;
  }

  const concluido = cronogramaHoje.concluido;

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${concluido ? "bg-green-500/20" : "bg-yellow-500/20"}`}>
        <div>
          <div className={`text-2xl font-bold ${concluido ? "text-green-400" : "text-yellow-300"}`}>
            {cronogramaHoje.qtd_simulados_meta}
          </div>
          <div className="text-sm text-muted-foreground">Simulados Meta</div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${concluido ? "text-green-400" : "text-yellow-300"}`}>
            {cronogramaHoje.paginas_leitura}
          </div>
          <div className="text-sm text-muted-foreground">Leitura</div>
        </div>
      </div>

      {!concluido && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Checklist Hoje</div>
              <div className="text-xs text-muted-foreground">
                • {cronogramaHoje.paginas_leitura} de leitura<br />
                • Simulado {cronogramaHoje.qtd_simulados_meta} ({cronogramaHoje.qtd_simulados_meta} simulado{cronogramaHoje.qtd_simulados_meta > 1 ? "s" : ""})
              </div>
            </div>
          </div>
        </div>
      )}

      {!concluido && (
        <Button
          onClick={async () => {
            await supabase
              .from("cronograma_dias")
              .update({ concluido: true })
              .eq("id", cronogramaHoje.id);
            setCronogramaHoje({ ...cronogramaHoje, concluido: true });
            toast.success("Tarefa concluída!", {
              description: "Parabéns por completar seus estudos de hoje!",
            });
          }}
          className="w-full"
        >
          Marcar como Concluído
        </Button>
      )}

      {!concluido && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Próximos passos</span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">
            Complete a leitura e o simulado de hoje para avançar no seu cronograma.
          </p>
        </div>
      )}
    </div>
  );
};
