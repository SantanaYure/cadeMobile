import { useMemo } from "react";
import { CATEGORY_LABELS } from "../constants/categories";
import { FILE_TYPE_LABELS } from "../constants/fileTypes";
import { AiSuggestion, FileCategory, FileItem } from "../types";
import { useFiles } from "./useFiles";

function collectFileIds(groups: { fileIds: string[] }[]): Set<string> {
  const ids = new Set<string>();
  groups.forEach((group) => group.fileIds.forEach((id) => ids.add(id)));
  return ids;
}

function matchesCategory(
  file: FileItem,
  category: FileCategory,
  duplicateFileIds: Set<string>,
  suggestionFileIds: Set<string>,
): boolean {
  switch (category) {
    case "all":
      return true;
    case "duplicates":
      return duplicateFileIds.has(file.id);
    case "aiSuggestions":
      return suggestionFileIds.has(file.id);
    default:
      return file.category === category;
  }
}

function matchesQuery(
  file: FileItem,
  suggestions: AiSuggestion[],
  query: string,
): boolean {
  if (query.length === 0) {
    return true;
  }

  const haystacks: string[] = [
    file.name,
    FILE_TYPE_LABELS[file.type],
    CATEGORY_LABELS[file.category],
  ];

  suggestions
    .filter((suggestion) => suggestion.fileId === file.id)
    .forEach((suggestion) => {
      haystacks.push(suggestion.reason);
      if (suggestion.suggestedName) {
        haystacks.push(suggestion.suggestedName);
      }
    });

  return haystacks.some((value) => value.toLowerCase().includes(query));
}

/**
 * Lista de arquivos filtrada pela categoria ativa e pela busca,
 * ordenada do mais recente para o mais antigo. Cálculo memoizado.
 */
export function useFileSearch(): FileItem[] {
  const { files, suggestions, duplicateGroups, activeCategory, searchQuery } =
    useFiles();

  return useMemo(() => {
    const duplicateFileIds = collectFileIds(duplicateGroups);
    const suggestionFileIds = new Set(
      suggestions
        .filter((suggestion) => suggestion.status === "pending")
        .map((suggestion) => suggestion.fileId),
    );
    const query = searchQuery.trim().toLowerCase();

    return files
      .filter((file) =>
        matchesCategory(file, activeCategory, duplicateFileIds, suggestionFileIds),
      )
      .filter((file) => matchesQuery(file, suggestions, query))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [files, suggestions, duplicateGroups, activeCategory, searchQuery]);
}
