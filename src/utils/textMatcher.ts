// Distância Levenshtein para aceitar erros leves de digitação (1 ou 2 letras trocadas)
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, () => [0]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Limpeza de texto (removendo acentos e cedilha)
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Remove acentos (combining diacritical marks)
    .trim();
}

// Validador principal
export function isValidAnswer(userInput: string, targetAliases: string[]): boolean {
  const cleanInput = normalizeText(userInput);
  if (!cleanInput) return false;

  return targetAliases.some((alias) => {
    const cleanAlias = normalizeText(alias);
    // Combinação exata sem acento
    if (cleanInput === cleanAlias) return true;
    // Contém o alias (ex: "casa amarela" contempla "casa")
    if (cleanInput.includes(cleanAlias) || cleanAlias.includes(cleanInput)) return true;

    // Aceita 1 erro de digitação para palavras pequenas (<=5 chars) e até 2 erros para maiores
    const maxDistance = cleanAlias.length <= 5 ? 1 : 2;
    return getLevenshteinDistance(cleanInput, cleanAlias) <= maxDistance;
  });
}
