"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const RhythmOptions = ["lento", "normal", "rapido"] as const;

const estudioSchema = yup.object({
  exam_date: yup.date().required("Data da prova é obrigatória"),
  days_of_week: yup.array().of(yup.string()).min(1, "Selecione pelo menos um dia").required("Dias da semana são obrigatórios"),
  daily_time: yup.number().min(15, "Mínimo 15 minutos").max(120, "Máximo 2 horas").required("Tempo diário é obrigatório"),
  reading_habit: yup.string().oneOf(RhythmOptions).required("Ritmo de leitura é obrigatório"),
  is_intensive_mode: yup.boolean(),
});

type EstudioConfigForm = yup.InferType<typeof estudoSchema>;

export const OnboardingModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useSupabase();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = useState<estudioConfigForm>({
    exam_date: new Date(),
    days_of_week: [],
    daily_time: 60,
    reading_habit: "normal",
    is_intensive_mode: false,
  });

  const { supabase } = useSupabase();

  const onSubmit = async (data: estudoConfigForm) => {
    try {
      const { error } = await supabase
        .from("estudo_config")
        .upsert(
          {
            user_id: user?.id || "",
            exam_date: data.exam_date,
            no_exam_date: false,
            days_of_week: data.days_of_week,
            daily_time: data.daily_time,
            reading_habit: data.reading_habit,
            is_intensive_mode: data.is_intensive_mode,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      toast({
        title: "Cronograma criado!",
        description: "Seu cronograma de estudos foi gerado com sucesso.",
      });

      setIsOpen(false);
      navigate("/app", { replace: true });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Falha ao criar cronograma",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/30 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-background transition-colors">
          <span>📅</span>
          <span>Meu Cronograma</span>
        </button>
      </DialogTrigger>

      <DialogContent hideClose>
        <DialogHeader>
          <DialogTitle>Configure seu Cronograma de Estudos</DialogTitle>
          <DialogDescription>
            Personalize seu plano de estudo para a prova do Detran
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={React.useCallback(async (e) => {
          e.preventDefault();
          await onSubmit(formData);
        }, [formData])}>
          
          <DialogBody>
            <Input
              label="Data da Prova"
              type="date"
              placeholder="DD/MM/AAAA"
              value={formData.exam_date}
              onChange={e => setFormData({ ...formData, exam_date: e.target.value as unknown as Date })}
              disabled={!!profile?.estudo_config?.exam_date}
            />
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Dias da Semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Domingo">Domingo</SelectItem>
                <SelectItem value="Segunda-feira">Segunda-feira</SelectItem>
                <SelectItem value="Terça-feira">Terça-feira</SelectItem>
                <SelectItem value="Quarta-feira">Quarta-feira</SelectItem>
                <SelectItem value="Quinta-feira">Quinta-feira</SelectItem>
                <SelectItem value="Sexta-feira">Sexta-feira</SelectItem>
                <SelectItem value="Sábado">Sábado</SelectItem>
              </SelectContent>
            </Select>

            <Input
              label="Tempo Diário (minutos)"
              type="number"
              min={15}
              max={120}
              value={formData.daily_time}
              onChange={e => setFormData({ ...formData, daily_time: Number(e.target.value) })}
              placeholder="Ex: 60"
            />

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ritmo de Leitura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lento">Lento (1.5 pág/15min)</SelectItem>
                <SelectItem value="normal">Normal (3 pág/15min)</SelectItem>
                <SelectItem value="rapido">Rápido (4.5 pág/15min)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
              checked={formData.is_intensive_mode}
              onChange={e => setFormData({ ...formData, is_intensive_mode: e.target.checked })}
                className="rounded border-primary/20 focus:ring-primary"
              />
              <span>Modo Intensivo (foco em simulados)</span>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" onClick={() => setIsOpen(false)} className="w-full py-2 px-4 rounded-lg border border-border/30 hover:bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
              Cancelar
            </Button>
            <Button type="submit" className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Gerar Cronograma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-4", className)} {...props} />
);