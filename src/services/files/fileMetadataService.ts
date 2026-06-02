import type { DocumentPickerAsset } from "expo-document-picker";
import { FileCategory, FileItem, FileType } from "../../types";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "heic", "bmp"];

function getExtension(fileName: string): string {
  const match = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

/**
 * Determina o tipo do arquivo a partir da extensão e, como apoio, do MIME type.
 */
function getFileType(fileName: string, mimeType?: string): FileType {
  const extension = getExtension(fileName);
  const mime = mimeType ?? "";

  if (IMAGE_EXTENSIONS.includes(extension) || mime.startsWith("image/")) {
    return "image";
  }
  if (extension === "pdf") {
    return "pdf";
  }
  if (extension === "docx" || extension === "doc") {
    return "docx";
  }
  if (extension === "txt") {
    return "txt";
  }
  if (extension === "csv") {
    return "csv";
  }
  if (extension === "xlsx" || extension === "xls") {
    return "spreadsheet";
  }
  return "other";
}

/**
 * Categoria inicial inferida apenas por tipo (regra simples e local).
 * A IA pode sugerir uma categoria melhor depois.
 */
function inferCategory(fileName: string, mimeType?: string): FileCategory {
  const type = getFileType(fileName, mimeType);
  if (type === "image") {
    return "images";
  }
  if (type === "other") {
    return "personal";
  }
  return "documents";
}

function createId(): string {
  return `file_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/**
 * Converte um asset do document picker em um FileItem do app.
 */
function fromPickerAsset(asset: DocumentPickerAsset): FileItem {
  const updatedAt = new Date(asset.lastModified).toISOString();

  return {
    id: createId(),
    name: asset.name,
    uri: asset.uri,
    size: asset.size ?? 0,
    mimeType: asset.mimeType ?? "application/octet-stream",
    type: getFileType(asset.name, asset.mimeType),
    category: inferCategory(asset.name, asset.mimeType),
    updatedAt,
  };
}

export const fileMetadataService = {
  fromPickerAsset,
  getFileType,
  inferCategory,
  getExtension,
};
