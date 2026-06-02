/**
 * Categorias fixas do MVP.
 * `all`, `duplicates` e `aiSuggestions` são categorias virtuais usadas como filtros.
 */
export type FileCategory =
  | "all"
  | "work"
  | "academic"
  | "personal"
  | "financial"
  | "documents"
  | "images"
  | "duplicates"
  | "aiSuggestions";
