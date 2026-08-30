import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { RaciocinioMIGQuiz } from "@/components/RaciocinioMIGQuiz";
import { MIG_QUESTIONS } from "@/data/raciocinioLogicoMIG";

export function AdminMigPreview() {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Pré-visualização do Teste MIG com feedback instantâneo — modo usado
          para gravar o vídeo de explicação (Super Admin).
        </p>
        <button
          onClick={() => setActive(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold shadow-glow hover:scale-[1.02] active:scale-95 transition-transform"
        >
          Abrir Teste MIG (Preview Admin)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setActive(false)}
        className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <RaciocinioMIGQuiz
        mode="treino"
        questions={MIG_QUESTIONS}
        timeLimit={300}
        isAdminPreview
        onFinish={() => {}}
        onHub={() => setActive(false)}
      />
    </div>
  );
}
