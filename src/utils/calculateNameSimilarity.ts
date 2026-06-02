import { normalizeFileName } from "./normalizeFileName";

/**
 * Distância de Levenshtein entre duas strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Calcula a semelhança (0 a 1) entre dois nomes de arquivo já normalizados.
 * 1 = nomes equivalentes; 0 = totalmente diferentes.
 */
export function calculateNameSimilarity(nameA: string, nameB: string): number {
  const normalizedA = normalizeFileName(nameA);
  const normalizedB = normalizeFileName(nameB);

  if (normalizedA.length === 0 && normalizedB.length === 0) {
    return 1;
  }
  if (normalizedA === normalizedB) {
    return 1;
  }

  const distance = levenshteinDistance(normalizedA, normalizedB);
  const maxLength = Math.max(normalizedA.length, normalizedB.length);
  if (maxLength === 0) {
    return 0;
  }

  return 1 - distance / maxLength;
}
