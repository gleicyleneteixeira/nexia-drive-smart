import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowLeft, GraduationCap, Sparkles } from "lucide-react";
import { Logico, useSpeech } from "@/routes/psicotecnico";
import { RaciocinioMIGQuiz } from "@/components/RaciocinioMIGQuiz";
import { MIG_QUESTIONS } from "@/data/raciocinioLogicoMIG";

export function RaciocinioLogicoView({ onBack }: { onBack: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const speech = useSpeech();

  return (
    <div className="mx-auto max-w-3xl px-1">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-glow font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4" /> Raciocínio Lógico
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">
            Teste <span className="gradient-text">MIG</span> — Detran
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Escolha o nível da avaliação. Você tem 2 minutos em cada um.
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs font-medium hover:bg-accent/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
      </div>

      {selectedLevel !== null && (
        <button
          onClick={() => setSelectedLevel(null)}
          className="inline-flex items-center gap-2 px-3 py-2 mb-3 rounded-lg glass text-xs font-medium hover:bg-accent/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Níveis
        </button>
      )}

      <AnimatePresence mode="wait">
        {selectedLevel === null && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => setSelectedLevel(1)}
              className="text-left glass rounded-2xl p-6 hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-success to-primary flex items-center justify-center mb-3 shadow-card">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-bold text-success uppercase">Nível 1</p>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Básico / Treino
              </h3>
              <p className="text-sm text-muted-foreground">
                Questões interativas de padrão lógico com feedback imediato a cada
                resposta.
              </p>
            </button>

            <button
              onClick={() => setSelectedLevel(2)}
              className="text-left glass rounded-2xl p-6 hover:bg-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-glow to-primary flex items-center justify-center mb-3 shadow-card">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-bold text-primary-glow uppercase">Nível 2</p>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Avançado / Prova Oficial MIG
              </h3>
              <p className="text-sm text-muted-foreground">
                {MIG_QUESTIONS.length} imagens oficiais do teste Detran com seleção
                [ A, B, C, D ].
              </p>
            </button>
          </motion.div>
        )}

        {selectedLevel === 1 && (
          <motion.div
            key="n1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Logico
              speech={speech}
              timeLimit={120}
              onDone={() => setSelectedLevel(null)}
            />
          </motion.div>
        )}

        {selectedLevel === 2 && (
          <motion.div
            key="n2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <RaciocinioMIGQuiz
              mode="prova"
              questions={MIG_QUESTIONS}
              timeLimit={120}
              onFinish={() => setSelectedLevel(null)}
              onHub={() => setSelectedLevel(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
