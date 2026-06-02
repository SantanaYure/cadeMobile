import { CATEGORY_LABELS } from "../../constants/categories";
import { AiSuggestion, FileCategory, FileItem } from "../../types";
import { fileSimilarityService } from "../files/fileSimilarityService";

/**
 * Serviço de IA SIMULADA do MVP.
 * Não chama nenhuma IA real: gera sugestões a partir de regras locais simples
 * sobre os metadados (nome, extensão, tamanho, data). Todas as mensagens são
 * assistivas e nenhuma alteração é aplicada sem confirmação do usuário.
 */

const CATEGORY_KEYWORDS: { category: FileCategory; keywords: string[] }[] = [
  {
    category: "financial",
    keywords: [
      "nota",
      "fiscal",
      "fatura",
      "boleto",
      "imposto",
      "orcamento",
      "extrato",
      "recibo",
      "pagamento",
    ],
  },
  {
    category: "work",
    keywords: [
      "relatorio",
      "contrato",
      "proposta",
      "apresentacao",
      "projeto",
      "reuniao",
      "ata",
      "planejamento",
    ],
  },
  {
    category: "academic",
    keywords: [
      "tcc",
      "trabalho",
      "aula",
      "artigo",
      "monografia",
      "prova",
      "estudo",
      "pesquisa",
      "metodologia",
    ],
  },
];

const VERSION_MARKERS = [
  "final",
  "definitivo",
  "agora",
  "vai",
  "atual",
  "novo",
  "ultimo",
  "ultima",
  "oficial",
];

const CAMERA_PREFIX =
  /^(img|dsc|photo|screenshot|whatsapp|captura|untitled|sem_titulo|novo_documento)/i;

function detectCategory(fileName: string): FileCategory | undefined {
  const lower = fileName.toLowerCase();
  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry.category;
    }
  }
  return undefined;
}

function hasVersionMarker(fileName: string): boolean {
  const tokens = ` ${fileName.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  if (/\bv\d+\b/.test(tokens)) {
    return true;
  }
  return VERSION_MARKERS.some((marker) => tokens.includes(` ${marker} `));
}

function isMessyName(fileName: string): boolean {
  const base = fileName.replace(/\.[^/.]+$/, "");
  const hasUpperCase = /[A-Z]/.test(base);
  return hasUpperCase || CAMERA_PREFIX.test(base);
}

function buildCleanName(fileName: string): string {
  const extensionMatch = fileName.match(/\.[^/.]+$/);
  const extension = extensionMatch ? extensionMatch[0].toLowerCase() : "";
  const base = fileName.slice(0, fileName.length - extension.length);
  const cleanBase = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${cleanBase}${extension}`;
}

function makeCategorySuggestion(
  file: FileItem,
  category: FileCategory,
): AiSuggestion {
  return {
    id: `suggestion_category_${file.id}`,
    fileId: file.id,
    kind: "category",
    suggestedCategory: category,
    confidence: 0.7,
    reason: `Pelo nome, parece ser da categoria "${CATEGORY_LABELS[category]}". Você pode revisar antes de aplicar.`,
    status: "pending",
  };
}

function makeRenameSuggestion(
  file: FileItem,
  suggestedName: string,
): AiSuggestion {
  return {
    id: `suggestion_rename_${file.id}`,
    fileId: file.id,
    kind: "rename",
    suggestedName,
    confidence: 0.6,
    reason:
      "O nome atual pode dificultar a busca. Sugestão de um nome mais claro. Revise antes de aplicar.",
    status: "pending",
  };
}

function makeDuplicateSuggestion(
  fileId: string,
  duplicateIds: string[],
  reason: string,
): AiSuggestion {
  return {
    id: `suggestion_duplicate_${fileId}`,
    fileId,
    kind: "duplicate",
    possibleDuplicateIds: duplicateIds,
    confidence: 0.85,
    reason: `Possível duplicata. ${reason} Você pode revisar antes de excluir.`,
    status: "pending",
  };
}

function makeNewerVersionSuggestion(
  file: FileItem,
  relatedIds: string[],
): AiSuggestion {
  return {
    id: `suggestion_newerVersion_${file.id}`,
    fileId: file.id,
    kind: "newerVersion",
    possibleDuplicateIds: relatedIds,
    confidence: 0.75,
    reason:
      "Esta pode ser a versão mais recente entre arquivos parecidos. Confira antes de organizar.",
    status: "pending",
  };
}

function generateSuggestions(files: FileItem[]): AiSuggestion[] {
  const suggestions: AiSuggestion[] = [];

  for (const file of files) {
    const detectedCategory = detectCategory(file.name);
    if (detectedCategory && detectedCategory !== file.category) {
      suggestions.push(makeCategorySuggestion(file, detectedCategory));
    }

    if (isMessyName(file.name)) {
      const cleanName = buildCleanName(file.name);
      if (cleanName.length > 0 && cleanName !== file.name) {
        suggestions.push(makeRenameSuggestion(file, cleanName));
      }
    }
  }

  const duplicateGroups = fileSimilarityService.findPotentialDuplicates(files);
  for (const group of duplicateGroups) {
    for (const fileId of group.fileIds) {
      const others = group.fileIds.filter((id) => id !== fileId);
      suggestions.push(makeDuplicateSuggestion(fileId, others, group.reason));
    }
  }

  const similarGroups = fileSimilarityService.findSimilarGroups(files);
  for (const group of similarGroups) {
    const groupFiles = files.filter((file) => group.fileIds.includes(file.id));
    const hasVersionedFile = groupFiles.some((file) =>
      hasVersionMarker(file.name),
    );

    if (hasVersionedFile && groupFiles.length > 1) {
      const newest = [...groupFiles].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )[0];
      const relatedIds = group.fileIds.filter((id) => id !== newest.id);
      suggestions.push(makeNewerVersionSuggestion(newest, relatedIds));
    }
  }

  return suggestions;
}

export const mockAiSuggestionService = {
  generateSuggestions,
};
