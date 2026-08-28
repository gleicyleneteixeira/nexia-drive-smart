export interface MIGQuestion {
  id: number;
  title: string;
  isExample: boolean;
  imageUrl: string;
  correctAnswer: "A" | "B" | "C" | "D";
}

const SUPABASE_BASE_URL =
  "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images";

export const RACIOCINIO_LOGICO_AVANCADO: MIGQuestion[] = [
  { id: 1, title: "Exemplo 01", isExample: true, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-7.png`, correctAnswer: "B" },
  { id: 2, title: "Exemplo 02", isExample: true, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-8.png`, correctAnswer: "C" },
  { id: 3, title: "Questão 01", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-9.png`, correctAnswer: "C" },
  { id: 4, title: "Questão 02", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-10.png`, correctAnswer: "D" },
  { id: 5, title: "Questão 03", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-11.png`, correctAnswer: "A" },
  { id: 6, title: "Questão 04", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-12.png`, correctAnswer: "B" },
  { id: 7, title: "Questão 05", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-13.png`, correctAnswer: "C" },
  { id: 8, title: "Questão 06", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-14.png`, correctAnswer: "D" },
  { id: 9, title: "Questão 07", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-15.png`, correctAnswer: "C" },
  { id: 10, title: "Questão 08", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-16.png`, correctAnswer: "B" },
  { id: 11, title: "Questão 09", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-17.png`, correctAnswer: "D" },
  { id: 12, title: "Questão 10", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-18.png`, correctAnswer: "B" },
  { id: 13, title: "Questão 11", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-19.png`, correctAnswer: "C" },
  { id: 14, title: "Questão 12", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-20.png`, correctAnswer: "B" },
  { id: 15, title: "Questão 13", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-21.png`, correctAnswer: "A" },
  { id: 16, title: "Questão 14", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-22.png`, correctAnswer: "D" },
  { id: 17, title: "Questão 15", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-23.png`, correctAnswer: "B" },
  { id: 18, title: "Questão 16", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-24.png`, correctAnswer: "B" },
  { id: 19, title: "Questão 17", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-25.png`, correctAnswer: "D" },
  { id: 20, title: "Questão 18", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-26.png`, correctAnswer: "C" },
  { id: 21, title: "Questão 19", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-27.png`, correctAnswer: "A" },
  { id: 22, title: "Questão 20", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-28.png`, correctAnswer: "D" },
  { id: 23, title: "Questão 21", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-29.png`, correctAnswer: "B" },
  { id: 24, title: "Questão 22", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-30.png`, correctAnswer: "D" },
  { id: 25, title: "Questão 23", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-31.png`, correctAnswer: "C" },
  { id: 26, title: "Questão 24", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-32.png`, correctAnswer: "A" },
  { id: 27, title: "Questão 25", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-33.png`, correctAnswer: "A" },
  { id: 28, title: "Questão 26", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-34.png`, correctAnswer: "C" },
  { id: 29, title: "Questão 27", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-35.png`, correctAnswer: "A" },
  { id: 30, title: "Questão 28", isExample: false, imageUrl: `${SUPABASE_BASE_URL}/Teste_Atencao_Concentrada_heyzine-36.png`, correctAnswer: "B" },
];

// Per the official MIG spec the batch contains 30 sequential items. The provided
// source listed 29 entries (id 11 skipped). We expose a normalized sequential id
// to keep the UI stable while preserving the original answer key above.
export const MIG_QUESTIONS: MIGQuestion[] = RACIOCINIO_LOGICO_AVANCADO.map((q, i) => ({
  ...q,
  id: i + 1,
}));

export const MIG_EXAMPLES = MIG_QUESTIONS.filter((q) => q.isExample);
export const MIG_OFFICIAL = MIG_QUESTIONS.filter((q) => !q.isExample);
