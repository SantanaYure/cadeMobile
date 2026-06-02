/**
 * Tokens de versão/ruído que não ajudam a distinguir um arquivo de outro.
 * São removidos na normalização para que versões do mesmo arquivo fiquem iguais.
 */
const NOISE_TOKENS = new Set([
  "final",
  "finalizado",
  "definitivo",
  "def",
  "copia",
  "copy",
  "novo",
  "nova",
  "new",
  "rev",
  "agora",
  "vai",
  "ultimo",
  "ultima",
  "atual",
  "oficial",
]);

const DIACRITICS_PATTERN = /[̀-ͯ]/g;

/**
 * Normaliza um nome de arquivo para comparação:
 * remove extensão, acentos, deixa minúsculo e descarta marcadores de versão.
 *
 * Exemplos:
 * - "relatorio_final.docx" -> "relatorio"
 * - "relatorio_final_v2.docx" -> "relatorio"
 * - "relatorio_FINAL_agora_vai.docx" -> "relatorio"
 */
export function normalizeFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const normalized = withoutExtension
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase();

  return normalized
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0)
    .filter((token) => !NOISE_TOKENS.has(token))
    .filter((token) => !/^v\d+$/.test(token))
    .join(" ");
}
