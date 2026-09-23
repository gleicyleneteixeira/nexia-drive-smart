import { RaciocinioMIGQuiz } from "@/components/RaciocinioMIGQuiz";
import { MIG_QUESTIONS } from "@/data/raciocinioLogicoMIG";

export function AdminMigPreview() {
  return (
    <RaciocinioMIGQuiz
      mode="treino"
      questions={MIG_QUESTIONS}
      timeLimit={300}
      isAdminPreview
      onFinish={() => {}}
      onHub={() => {}}
    />
  );
}
