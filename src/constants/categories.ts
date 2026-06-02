import type { IconName } from "../components/ui/AppIcon";
import { FileCategory } from "../types";

export type CategoryDefinition = {
  id: FileCategory;
  label: string; // PT-BR
  icon: IconName;
};

/**
 * Categorias fixas do MVP, na ordem exibida nos chips.
 * `all`, `duplicates` e `aiSuggestions` são filtros virtuais.
 */
export const CATEGORIES: CategoryDefinition[] = [
  { id: "all", label: "Todos", icon: "view-grid-outline" },
  { id: "work", label: "Trabalho", icon: "briefcase-outline" },
  { id: "academic", label: "Acadêmico", icon: "school-outline" },
  { id: "personal", label: "Pessoal", icon: "account-outline" },
  { id: "financial", label: "Financeiro", icon: "cash-multiple" },
  { id: "documents", label: "Documentos", icon: "file-document-outline" },
  { id: "images", label: "Imagens", icon: "image-outline" },
  { id: "duplicates", label: "Duplicados", icon: "content-copy" },
  { id: "aiSuggestions", label: "Sugestões da IA", icon: "robot-outline" },
];

export const CATEGORY_LABELS: Record<FileCategory, string> = CATEGORIES.reduce(
  (labels, category) => {
    labels[category.id] = category.label;
    return labels;
  },
  {} as Record<FileCategory, string>,
);
