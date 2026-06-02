const UNITS = ["B", "KB", "MB", "GB", "TB"];

/**
 * Formata um tamanho em bytes para texto legível em pt-BR (ex.: "1,2 MB").
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  const rounded =
    exponent === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  const text = rounded.toString().replace(".", ",");

  return `${text} ${UNITS[exponent]}`;
}
