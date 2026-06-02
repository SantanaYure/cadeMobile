import { DuplicateGroup, FileItem, SimilarGroup } from "../../types";
import { calculateNameSimilarity } from "../../utils/calculateNameSimilarity";

const SIMILARITY_THRESHOLD = 0.8;
const CLOSE_DATE_RANGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

function getExtension(fileName: string): string {
  const match = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

function haveSimilarNames(fileA: FileItem, fileB: FileItem): boolean {
  return calculateNameSimilarity(fileA.name, fileB.name) >= SIMILARITY_THRESHOLD;
}

/**
 * Agrupa arquivos com nomes muito parecidos (independente de tipo/tamanho).
 */
function findSimilarGroups(files: FileItem[]): SimilarGroup[] {
  const groups: SimilarGroup[] = [];
  const grouped = new Set<string>();

  for (const file of files) {
    if (grouped.has(file.id)) {
      continue;
    }

    const matches = files.filter(
      (other) =>
        other.id !== file.id &&
        !grouped.has(other.id) &&
        haveSimilarNames(file, other),
    );

    if (matches.length > 0) {
      const fileIds = [file.id, ...matches.map((match) => match.id)];
      fileIds.forEach((id) => grouped.add(id));
      groups.push({ id: `similar_${file.id}`, fileIds });
    }
  }

  return groups;
}

function evaluateDuplicate(
  fileA: FileItem,
  fileB: FileItem,
): { isDuplicate: boolean; reason: string } {
  if (getExtension(fileA.name) !== getExtension(fileB.name)) {
    return { isDuplicate: false, reason: "" };
  }
  if (!haveSimilarNames(fileA, fileB)) {
    return { isDuplicate: false, reason: "" };
  }

  const sameSize = fileA.size === fileB.size && fileA.size > 0;
  if (sameSize) {
    return {
      isDuplicate: true,
      reason: "Mesmo tamanho e nome muito parecido.",
    };
  }

  const dateDistance = Math.abs(
    new Date(fileA.updatedAt).getTime() - new Date(fileB.updatedAt).getTime(),
  );
  if (dateDistance <= CLOSE_DATE_RANGE_MS) {
    return {
      isDuplicate: true,
      reason: "Mesma extensão, datas próximas e nome muito parecido.",
    };
  }

  return { isDuplicate: false, reason: "" };
}

/**
 * Identifica possíveis duplicatas: mesma extensão + nome parecido +
 * (mesmo tamanho OU datas próximas).
 */
function findPotentialDuplicates(files: FileItem[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const grouped = new Set<string>();

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (grouped.has(file.id)) {
      continue;
    }

    const matches: FileItem[] = [];
    let reason = "";

    for (let j = 0; j < files.length; j += 1) {
      if (i === j) {
        continue;
      }
      const other = files[j];
      if (grouped.has(other.id)) {
        continue;
      }

      const result = evaluateDuplicate(file, other);
      if (result.isDuplicate) {
        matches.push(other);
        reason = result.reason;
      }
    }

    if (matches.length > 0) {
      const fileIds = [file.id, ...matches.map((match) => match.id)];
      fileIds.forEach((id) => grouped.add(id));
      groups.push({ id: `duplicate_${file.id}`, fileIds, reason });
    }
  }

  return groups;
}

export const fileSimilarityService = {
  findSimilarGroups,
  findPotentialDuplicates,
};
