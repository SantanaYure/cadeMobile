import { FileCategory } from "./category";

export type FileType =
  | "pdf"
  | "docx"
  | "txt"
  | "csv"
  | "image"
  | "spreadsheet"
  | "other";

export type FileItem = {
  id: string;
  name: string;
  uri: string;
  size: number;
  mimeType: string;
  type: FileType;
  category: FileCategory;
  updatedAt: string; // ISO 8601
  createdAt?: string; // ISO 8601
};

/** Grupo de arquivos com nomes muito parecidos. */
export type SimilarGroup = {
  id: string;
  fileIds: string[];
};

/** Grupo de possíveis duplicatas, com a razão para o usuário. */
export type DuplicateGroup = {
  id: string;
  fileIds: string[];
  reason: string;
};
