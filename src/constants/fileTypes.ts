import type { IconName } from "../components/ui/AppIcon";
import { FileType } from "../types";

/** Rótulo curto do tipo de arquivo (PT-BR), exibido nos cards e na busca. */
export const FILE_TYPE_LABELS: Record<FileType, string> = {
  pdf: "PDF",
  docx: "DOCX",
  txt: "TXT",
  csv: "CSV",
  image: "Imagem",
  spreadsheet: "Planilha",
  other: "Arquivo",
};

/** Ícone por tipo de arquivo (Material Community Icons). */
export const FILE_TYPE_ICONS: Record<FileType, IconName> = {
  pdf: "file-pdf-box",
  docx: "file-word-box",
  txt: "file-document-outline",
  csv: "file-delimited-outline",
  image: "file-image-outline",
  spreadsheet: "file-table-outline",
  other: "file-outline",
};
