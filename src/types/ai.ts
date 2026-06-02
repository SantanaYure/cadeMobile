import { FileCategory } from "./category";

export type AiSuggestionKind = "category" | "rename" | "duplicate" | "newerVersion";

export type AiSuggestionStatus = "pending" | "accepted" | "ignored";

export type AiSuggestion = {
  id: string;
  fileId: string;
  kind: AiSuggestionKind;
  suggestedCategory?: FileCategory;
  suggestedName?: string;
  possibleDuplicateIds?: string[];
  confidence?: number;
  reason: string; // texto para o usuário (PT-BR), sempre assistivo
  status: AiSuggestionStatus;
};
