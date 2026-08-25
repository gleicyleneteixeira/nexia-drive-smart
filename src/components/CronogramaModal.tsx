"use client";

import * as React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Edit3, FileDown, BookOpen } from "lucide-react";
import { toPng } from "html-to-image";
import { exportScheduleToPDF } from "@/lib/exportUtils";
import { getReadingUrl } from "@/lib/heyzine";

type EstudoConfigRow = Database["public"]["Tables"]["estudo_config"]["Row"];

export interface PlanoEstudo {
  habitoLeitura: string;
  tempoDiario: number;
  selectedDays: string[];
  calculatedPages: number;
  studyDaysNeeded: number;
  weeksNeeded: number;
  finishDate: string;
  semData: boolean;
  intensiveAtivo: boolean;
  dataProva: string | null;
  prontoATempo: boolean;
}

interface CronogramaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BOOK_CHAPTERS = [
  { id: 1, title: "Capítulo 1 - Legislação de Trânsito", startPage: 17, endPage: 44, totalPages: 28 },
  { id: 2, title: "Capítulo 2 - Direção Defensiva", startPage: 45, endPage: 71, totalPages: 27 },
  { id: 3, title: "Capítulo 3 - Noções de Primeiros Socorros", startPage: 72, endPage: 78, totalPages: 7 },
  { id: 4, title: "Capítulo 4 - Meio Ambiente e Convívio Social", startPage: 79, endPage: 95, totalPages: 17 },
  { id: 5, title: "Capítulo 5 - Funcionamento do Veículo (Mecânica)", startPage: 96, endPage: 104, totalPages: 9 },
];

export const TOTAL_THEORETICAL_PAGES = 88;
const START_PAGE = 17;
const END_PAGE = 104;

const DAY_NAMES = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const META_POR_CAPITULO: Record<number, string> = {
  1: "Fixar regras de sinalização e legislação",
  2: "Praticar a postura de direção defensiva",
  3: "Revisar procedimentos de primeiros socorros",
  4: "Refletir sobre o convívio social no trânsito",
  5: "Entender os componentes do veículo",
};

export interface ScheduleItem {
  dia: number;
  data: string;
  capitulo: string;
  capituloId: number;
  paginaInicio: number;
  paginaFim: number;
}

function capituloDaPagina(pag: number): { titulo: string; id: number } {
  const c = BOOK_CHAPTERS.find((ch) => pag >= ch.startPage && pag <= ch.endPage);
  return c ? { titulo: c.title, id: c.id } : { titulo: "Livro do Detran", id: 0 };
}

export function buildScheduleItems(plan: PlanoEstudo): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  let paginaAtual = START_PAGE;
  let diaNum = 1;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const d = new Date(hoje);
  let guard = 0;
  while (paginaAtual <= END_PAGE && guard < 500) {
    guard++;
    const dayName = DAY_NAMES[d.getDay()];
    if (plan.selectedDays.includes(dayName)) {
      const paginaFim = Math.min(paginaAtual + plan.calculatedPages - 1, END_PAGE);
      const cap = capituloDaPagina(paginaAtual);
      items.push({
        dia: diaNum,
        data: d.toISOString().split("T")[0],
        capitulo: cap.titulo,
        capituloId: cap.id,
        paginaInicio: paginaAtual,
        paginaFim,
      });
      paginaAtual = paginaFim + 1;
      diaNum++;
    }
    d.setDate(d.getDate() + 1);
  }
  return items;
}

function getFinishDate(selectedDays: string[], studyDaysNeeded: number, maxDate: Date | null): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (selectedDays.length === 0 || studyDaysNeeded <= 0) return d;
  let count = 0;
  while (count < studyDaysNeeded) {
    if (selectedDays.includes(DAY_NAMES[d.getDay()])) count++;
    if (count < studyDaysNeeded) {
      d.setDate(d.getDate() + 1);
      if (maxDate && d > maxDate) break;
    }
  }
  return d;
}

function computePlano(input: {
  habitoLeitura: string;
  tempoDiario: number;
  selectedDays: string[];
  dataProva: string | null;
  semData: boolean;
  intensiveAtivo: boolean;
}): PlanoEstudo {
  const pagesPer15 =
    input.habitoLeitura === "raramente" ? 1.5 : input.habitoLeitura === "frequentemente" ? 4.5 : 3;
  const normalPages = Math.max(1, Math.round((input.tempoDiario / 15) * pagesPer15));
  const normalDaysNeeded =
    input.selectedDays.length > 0 ? Math.ceil(TOTAL_THEORETICAL_PAGES / normalPages) : 0;

  // Dias de estudo disponíveis até a data da prova
  let studyDaysAvailable = 0;
  const examDateObj = input.semData
    ? null
    : input.dataProva
      ? new Date(input.dataProva + "T00:00:00")
      : null;
  if (examDateObj && input.selectedDays.length > 0) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const d = new Date(hoje);
    while (d <= examDateObj) {
      if (input.selectedDays.includes(DAY_NAMES[d.getDay()])) studyDaysAvailable++;
      d.setDate(d.getDate() + 1);
    }
  }

  // Recálculo inteligente quando a prova está próxima
  const precisaIntensivo =
    !input.semData &&
    input.selectedDays.length > 0 &&
    studyDaysAvailable > 0 &&
    studyDaysAvailable < normalDaysNeeded;

  let effectivePages = normalPages;
  let effectiveDailyTime = input.tempoDiario;
  let intensiveAtivo = precisaIntensivo ? true : input.intensiveAtivo;

  if (precisaIntensivo && studyDaysAvailable > 0) {
    effectivePages = Math.max(1, Math.ceil(TOTAL_THEORETICAL_PAGES / studyDaysAvailable));
    effectiveDailyTime = Math.max(15, Math.ceil(effectivePages * 3));
    intensiveAtivo = true;
  }

  const effectiveDaysNeeded =
    input.selectedDays.length > 0 ? Math.ceil(TOTAL_THEORETICAL_PAGES / effectivePages) : 0;
  const finishDateObj = getFinishDate(input.selectedDays, effectiveDaysNeeded, examDateObj);
  const finishDate = finishDateObj.toLocaleDateString("pt-BR");
  const prontoATempo = input.semData ? true : finishDateObj <= (examDateObj as Date);

  return {
    habitoLeitura: input.habitoLeitura,
    tempoDiario: effectiveDailyTime,
    selectedDays: input.selectedDays,
    calculatedPages: effectivePages,
    studyDaysNeeded: effectiveDaysNeeded,
    weeksNeeded:
      input.selectedDays.length > 0 ? Math.ceil(effectiveDaysNeeded / input.selectedDays.length) : 0,
    finishDate,
    semData: input.semData,
    intensiveAtivo,
    dataProva: input.semData ? null : input.dataProva,
    prontoATempo,
  };
}

export function buildPlanoFromConfig(config: EstudoConfigRow): PlanoEstudo {
  const days = Array.isArray(config.days_of_week) ? (config.days_of_week as string[]) : [];
  return computePlano({
    habitoLeitura: config.reading_habit,
    tempoDiario: config.daily_time,
    selectedDays: days,
    dataProva: config.exam_date,
    semData: config.no_exam_date,
    intensiveAtivo: config.is_intensive_mode,
  });
}

export const CronogramaModal = ({ open, onOpenChange }: CronogramaModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [plano, setPlano] = React.useState<PlanoEstudo | null>(null);
  const [configInicial, setConfigInicial] = React.useState<EstudoConfigRow | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const carregar = React.useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("estudo_config")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setConfigInicial(data);
      setPlano(buildPlanoFromConfig(data));
    } else {
      setConfigInicial(null);
      setPlano(null);
    }
  }, []);

  React.useEffect(() => {
    if (!open) {
      setIsLoading(true);
      setPlano(null);
      setConfigInicial(null);
      setIsEditing(false);
      return;
    }
    if (!user?.id) return;
    setIsLoading(true);
    carregar(user.id).finally(() => setIsLoading(false));
  }, [open, user?.id, carregar]);

  if (isLoading && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <p className="text-muted-foreground text-center py-4">Verificando cronograma...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {plano && !isEditing ? (
        <CronogramaOverview
          plan={plano}
          userName={
            user?.user_metadata?.name ||
            user?.user_metadata?.full_name ||
            user?.email ||
            "Aluno(a)"
          }
          onEdit={() => setIsEditing(true)}
          onClose={() => onOpenChange(false)}
        />
      ) : (
        <CronogramaForm
          userId={user?.id || ""}
          initial={plano ? configInicial : null}
          onSuccess={(p) => {
            setPlano(p);
            setIsEditing(false);
            if (user?.id) carregar(user.id);
          }}
          onCancel={() => (plano ? setIsEditing(false) : onOpenChange(false))}
        />
      )}
    </Dialog>
  );
};

function CronogramaForm({
  userId,
  initial,
  onSuccess,
  onCancel,
}: {
  userId: string;
  initial?: EstudoConfigRow | null;
  onSuccess: (plan: PlanoEstudo) => void;
  onCancel: () => void;
}) {
  const isEditing = !!initial;
  const [dataProva, setDataProva] = React.useState(
    initial?.exam_date || new Date().toISOString().split("T")[0]
  );
  const [semData, setSemData] = React.useState(initial?.no_exam_date || false);
  const [selectedDays, setSelectedDays] = React.useState<string[]>(
    Array.isArray(initial?.days_of_week) ? (initial.days_of_week as string[]) : []
  );
  const [tempoDiario, setTempoDiario] = React.useState(initial?.daily_time || 60);
  const [habitoLeitura, setHabitoLeitura] = React.useState(initial?.reading_habit || "as_vezes");
  const [modoIntensivo, setModoIntensivo] = React.useState(initial?.is_intensive_mode || false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Fonte única de cálculo: computePlano (recálculo inteligente por data de prova)
  const planoPreview = computePlano({
    habitoLeitura,
    tempoDiario,
    selectedDays,
    dataProva: semData ? null : dataProva,
    semData,
    intensiveAtivo: modoIntensivo,
  });
  const calculatedPages = planoPreview.calculatedPages;
  const studyDaysNeeded = planoPreview.studyDaysNeeded;
  const precisaIntensivo = planoPreview.intensiveAtivo && !modoIntensivo;
  const intensiveAtivo = planoPreview.intensiveAtivo;
  const calculatedFinishDate = planoPreview.finishDate;

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      toast.error("Selecione pelo menos um dia da semana");
      return;
    }

    setIsGenerating(true);

    // Se não tem data marcada, usa 60 dias a partir de hoje como referência interna
    const dataProvaFinal = semData
      ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : dataProva;

    try {
      const { error } = await supabase
        .from("estudo_config")
        .upsert(
          {
            user_id: userId,
            exam_date: semData ? null : dataProvaFinal,
            no_exam_date: semData,
            days_of_week: selectedDays,
            daily_time: tempoDiario,
            reading_habit: habitoLeitura,
            is_intensive_mode: intensiveAtivo,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      toast.success(isEditing ? "Cronograma atualizado!" : "Cronograma criado!", {
        description: "Seu plano de estudos foi configurado com sucesso.",
      });

      onSuccess(
        computePlano({
          habitoLeitura,
          tempoDiario,
          selectedDays,
          dataProva: semData ? null : dataProvaFinal,
          semData,
          intensiveAtivo,
        })
      );
    } catch (err: any) {
      toast.error("Erro", {
        description: err.message || "Falha ao salvar cronograma",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const allDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  return (
    <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="break-words">
          {isEditing ? "Editar seu Cronograma de Estudos" : "Configure seu Cronograma de Estudos"}
        </DialogTitle>
        <DialogDescription>
          Personalize seu plano de estudo para a prova do Detran
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Data da Prova</label>
          <Input
            type="date"
            value={dataProva}
            disabled={semData}
            onChange={(e) => setDataProva(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={semData}
            onChange={(e) => setSemData(e.target.checked)}
            className="rounded border-primary/20"
          />
          <span className="text-sm">Ainda não tenho data marcada para a prova</span>
        </div>

        <div>
          <label className="text-sm font-medium">Dias da Semana</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {allDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  selectedDays.includes(day)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary/50"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`text-sm font-medium ${precisaIntensivo ? "text-muted-foreground/70" : ""}`}>
            Tempo Diário (minutos)
          </label>
          <Select
            value={String(tempoDiario)}
            onValueChange={(v) => setTempoDiario(Number(v))}
            disabled={precisaIntensivo}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="20">20 minutos</SelectItem>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="45">45 minutos</SelectItem>
              <SelectItem value="60">60 minutos (1 hora)</SelectItem>
              <SelectItem value="90">90 minutos (1h 30m)</SelectItem>
              <SelectItem value="120">120 minutos (2 horas)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className={`text-sm font-medium ${precisaIntensivo ? "text-muted-foreground/70" : ""}`}>
            Hábito de Leitura
          </label>
          <Select value={habitoLeitura} onValueChange={setHabitoLeitura} disabled={precisaIntensivo}>
            <SelectTrigger>
              <SelectValue placeholder="Com que frequência você lê?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raramente">Raramente / Quase nunca</SelectItem>
              <SelectItem value="as_vezes">Às vezes (Lê casualmente)</SelectItem>
              <SelectItem value="frequentemente">Frequentemente (Lê com facilidade)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={intensiveAtivo}
            disabled={precisaIntensivo}
            onChange={(e) => setModoIntensivo(e.target.checked)}
            className="rounded border-primary/20 disabled:opacity-50"
          />
          <span className="text-sm">Modo Intensivo (foco em simulados)</span>
        </div>

        {precisaIntensivo && (
          <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 space-y-1">
            <p>⚡ Modo Intensivo ativado automaticamente devido à proximidade da prova!</p>
            <p className="text-amber-200/90">
              Para garantir que você termine a tempo, os campos <strong>Tempo Diário</strong> e
              <strong> Hábito de Leitura</strong> foram bloqueados e ajustados automaticamente.
            </p>
          </div>
        )}

        {selectedDays.length > 0 && (
          <div className="p-3.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs text-slate-200 space-y-1.5">
            {precisaIntensivo ? (
              <p className="font-semibold text-amber-400">⚡ Plano Ajustado para sua Prova ({calculatedFinishDate})</p>
            ) : (
              <p className="font-semibold text-blue-400">💡 Previsão do seu Plano de Estudos:</p>
            )}
            <p>
              Com seu ritmo, você lerá cerca de <strong>{calculatedPages} páginas</strong> por dia.
            </p>
            <p>
              Tempo total: <strong>{studyDaysNeeded} dias de estudo</strong>.
              {semData
                ? " Você estará pronto em breve!"
                : ` Conclusão prevista: ${calculatedFinishDate}.`}
            </p>
            {precisaIntensivo && (
              <p className="text-amber-300/90">
                Sua prova está próxima, então ajustamos as páginas diárias para você terminar a tempo. ✅
              </p>
            )}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isGenerating} className="w-full sm:w-auto">
          {isGenerating ? "Salvando..." : isEditing ? "Salvar Alterações" : "Gerar Cronograma"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CronogramaOverview({
  plan,
  userName,
  onEdit,
  onClose,
}: {
  plan: PlanoEstudo;
  userName: string;
  onEdit: () => void;
  onClose: () => void;
}) {
  const scheduleItems = React.useMemo(() => buildScheduleItems(plan), [plan]);
  const [isPdfGenerating, setIsPdfGenerating] = React.useState(false);

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsPdfGenerating(true);
    try {
      await exportScheduleToPDF(cardRef.current, userName);
      toast.success("PDF gerado!", {
        description: "Seu cronograma em PDF foi baixado.",
      });
    } catch (err) {
      console.error("Erro ao exportar PDF do cronograma:", err);
      toast.error("Erro ao gerar PDF", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const nomeDoDia = (data: string) =>
    new Date(data + "T00:00:00")
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: "#0f172a",
      });
      const link = document.createElement("a");
      link.download = "Meu-Cronograma-Detran.png";
      link.href = dataUrl;
      link.click();
      toast.success("Imagem baixada!", {
        description: "Seu cronograma foi salvo como imagem.",
      });
    } catch (err) {
      console.error("Erro ao exportar imagem do cronograma:", err);
      toast.error("Erro ao salvar imagem", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="break-words">Seu Plano de Estudos Personalizado</DialogTitle>
        <DialogDescription className="break-words">
          Acompanhe suas metas para a prova do Detran
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[75vh] overflow-y-auto pr-1">
        {/* Container capturado como imagem */}
        <div
          ref={cardRef}
          className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 space-y-5"
        >
          {/* Cabeçalho personalizado */}
          <div className="text-center border-b border-slate-800 pb-4">
            <h2 className="text-xl font-extrabold tracking-wide text-white">
              CRONOGRAMA DE ESTUDOS — PROVA TEÓRICA DETRAN
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Aluno(a): <span className="font-semibold text-blue-400">{userName}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Foco hoje, Aprovação amanhã! 🚗⚡</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-[11px] text-slate-400 font-medium">Meta Diária</p>
              <p className="text-base font-bold text-blue-400">{plan.calculatedPages} páginas / dia</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-[11px] text-slate-400 font-medium">Tempo Estimado</p>
              <p className="text-base font-bold text-slate-100">{plan.studyDaysNeeded} dias de estudo</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-[11px] text-slate-400 font-medium">Previsão para Prova</p>
              <p className="text-base font-bold text-emerald-400">{plan.finishDate}</p>
            </div>
          </div>

          {/* Tabela do planner */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200">
                  <th className="border border-slate-700 px-2 py-2 text-left font-semibold">DIA / DIA DA SEMANA</th>
                  <th className="border border-slate-700 px-2 py-2 text-left font-semibold">TEMA DO LIVRINHO</th>
                  <th className="border border-slate-700 px-2 py-2 text-left font-semibold">O QUE LER (PÁGINAS)</th>
                  <th className="border border-slate-700 px-2 py-2 text-left font-semibold">ATIVIDADE PRÁTICA (DIÁRIA)</th>
                  <th className="border border-slate-700 px-2 py-2 text-left font-semibold">META DO DIA</th>
                </tr>
              </thead>
              <tbody>
                {scheduleItems.map((s) => (
                  <tr key={s.dia} className="align-top">
                    <td className="border border-slate-700 px-2 py-2">
                      <p className="font-bold text-slate-100">DIA {s.dia}</p>
                      <p className="text-slate-400">({nomeDoDia(s.data)})</p>
                    </td>
                    <td className="border border-slate-700 px-2 py-2 text-slate-200">{s.capitulo}</td>
                    <td className="border border-slate-700 px-2 py-2 text-slate-200">
                      Páginas {s.paginaInicio} a {s.paginaFim} (Capítulo {s.capituloId || "—"})
                    </td>
                    <td className="border border-slate-700 px-2 py-2 text-slate-200">
                      📝 Responder 1 Simulado no App
                    </td>
                    <td className="border border-slate-700 px-2 py-2 text-slate-200">
                      {META_POR_CAPITULO[s.capituloId] || "Revisar o conteúdo lido"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {plan.intensiveAtivo && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
              ⚡ <strong>Modo Intensivo Ativo:</strong> Devido à proximidade da sua prova,
              recomendamos focar prioritariamente nos simulados e na revisão rápida.
            </div>
          )}

          {/* Dicas de Ouro */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <p className="text-sm font-semibold text-emerald-300 mb-2">💡 Dicas de Ouro</p>
            <ul className="text-xs text-slate-200 space-y-1">
              <li>✔ Estude um pouco todos os dias (a constância vence a memória de curto prazo).</li>
              <li>✔ Faça pelo menos 1 simulado diariamente.</li>
              <li>✔ Anote suas dúvidas e revise os cards na Revisão Turbo.</li>
              <li>✔ Lembre-se: Disciplina Hoje = Carteira na Mão Amanhã!</li>
            </ul>
          </div>
        </div>
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Salvando..." : "Salvar Imagem"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isPdfGenerating}
            className="flex-1 sm:flex-none"
          >
            <FileDown className="h-4 w-4 mr-2" />
            {isPdfGenerating ? "Gerando PDF..." : "Baixar PDF"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="flex-1 sm:flex-none"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Cronograma
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              const targetPage = scheduleItems[0]?.paginaInicio ?? 17;
              window.open(getReadingUrl(targetPage), "_blank");
            }}
            className="flex-1 sm:flex-none"
          >
            Começar a Estudar Agora
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
