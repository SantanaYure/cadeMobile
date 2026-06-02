import * as DocumentPicker from "expo-document-picker";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SAMPLE_FILES } from "../constants/sampleFiles";
import { AppEventName, notifyAppEvent } from "../events/appEvents";
import { fileMetadataService } from "../services/files/fileMetadataService";
import { fileSimilarityService } from "../services/files/fileSimilarityService";
import { mockAiSuggestionService } from "../services/ai/mockAiSuggestionService";
import {
  AiSuggestion,
  AiSuggestionStatus,
  AppError,
  DuplicateGroup,
  FileCategory,
  FileItem,
  SimilarGroup,
} from "../types";

const SAMPLE_ANALYSIS_DELAY_MS = 600;

type FilesContextValue = {
  files: FileItem[];
  loading: boolean;
  error: AppError | null;
  activeCategory: FileCategory;
  searchQuery: string;
  suggestions: AiSuggestion[];
  duplicateGroups: DuplicateGroup[];
  similarGroups: SimilarGroup[];
  selectFiles: () => Promise<void>;
  loadSampleFiles: () => void;
  clearFiles: () => void;
  clearError: () => void;
  renameFile: (fileId: string, newName: string) => void;
  deleteFile: (fileId: string) => void;
  acceptSuggestion: (suggestion: AiSuggestion) => void;
  ignoreSuggestion: (suggestionId: string) => void;
  setActiveCategory: (category: FileCategory) => void;
  setSearchQuery: (query: string) => void;
};

const FilesContext = createContext<FilesContextValue | null>(null);

function mergeFilesByUri(current: FileItem[], incoming: FileItem[]): FileItem[] {
  const existingUris = new Set(current.map((file) => file.uri));
  const newFiles = incoming.filter((file) => !existingUris.has(file.uri));
  return [...newFiles, ...current];
}

function applySuggestionToFiles(
  files: FileItem[],
  suggestion: AiSuggestion,
): FileItem[] {
  if (suggestion.kind === "category" && suggestion.suggestedCategory) {
    const nextCategory = suggestion.suggestedCategory;
    return files.map((file) =>
      file.id === suggestion.fileId
        ? { ...file, category: nextCategory }
        : file,
    );
  }

  if (suggestion.kind === "rename" && suggestion.suggestedName) {
    const nextName = suggestion.suggestedName;
    return files.map((file) =>
      file.id === suggestion.fileId ? { ...file, name: nextName } : file,
    );
  }

  // duplicate / newerVersion são informativas: não alteram o arquivo sozinhas.
  return files;
}

/**
 * Estado global mínimo do app: arquivos carregados, filtros e dados derivados
 * (sugestões da IA, grupos de similaridade e duplicatas). Mantém os arquivos
 * apenas em memória nesta versão.
 */
export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [activeCategory, setActiveCategoryState] =
    useState<FileCategory>("all");
  const [searchQuery, setSearchQueryState] = useState("");
  const [suggestionStatuses, setSuggestionStatuses] = useState<
    Record<string, AiSuggestionStatus>
  >({});

  const baseSuggestions = useMemo(
    () => mockAiSuggestionService.generateSuggestions(files),
    [files],
  );

  const suggestions = useMemo<AiSuggestion[]>(
    () =>
      baseSuggestions.map((suggestion) => ({
        ...suggestion,
        status: suggestionStatuses[suggestion.id] ?? "pending",
      })),
    [baseSuggestions, suggestionStatuses],
  );

  const duplicateGroups = useMemo(
    () => fileSimilarityService.findPotentialDuplicates(files),
    [files],
  );

  const similarGroups = useMemo(
    () => fileSimilarityService.findSimilarGroups(files),
    [files],
  );

  const selectFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const pickedFiles = result.assets.map(fileMetadataService.fromPickerAsset);
      setFiles((current) => mergeFilesByUri(current, pickedFiles));
      notifyAppEvent(AppEventName.FILES_SELECTED, {
        count: pickedFiles.length,
      });
    } catch (caughtError) {
      setError({
        userMessage:
          "Não foi possível selecionar os arquivos. Tente novamente.",
        technicalMessage:
          caughtError instanceof Error
            ? caughtError.message
            : String(caughtError),
        code: "FILE_PICK_FAILED",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSampleFiles = useCallback(() => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setFiles((current) => mergeFilesByUri(current, SAMPLE_FILES));
      notifyAppEvent(AppEventName.SAMPLE_FILES_LOADED, {
        count: SAMPLE_FILES.length,
      });
      setLoading(false);
    }, SAMPLE_ANALYSIS_DELAY_MS);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setSuggestionStatuses({});
    notifyAppEvent(AppEventName.FILES_CLEARED);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const renameFile = useCallback((fileId: string, newName: string) => {
    setFiles((current) =>
      current.map((file) =>
        file.id === fileId
          ? { ...file, name: newName, updatedAt: new Date().toISOString() }
          : file,
      ),
    );
    notifyAppEvent(AppEventName.FILE_RENAME_REQUESTED, { fileId });
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles((current) => current.filter((file) => file.id !== fileId));
    notifyAppEvent(AppEventName.FILE_DELETE_REQUESTED, { fileId });
  }, []);

  const acceptSuggestion = useCallback((suggestion: AiSuggestion) => {
    setFiles((current) => applySuggestionToFiles(current, suggestion));
    setSuggestionStatuses((current) => ({
      ...current,
      [suggestion.id]: "accepted",
    }));
    notifyAppEvent(AppEventName.AI_SUGGESTION_ACCEPTED, {
      id: suggestion.id,
      kind: suggestion.kind,
    });
  }, []);

  const ignoreSuggestion = useCallback((suggestionId: string) => {
    setSuggestionStatuses((current) => ({
      ...current,
      [suggestionId]: "ignored",
    }));
    notifyAppEvent(AppEventName.AI_SUGGESTION_IGNORED, { id: suggestionId });
  }, []);

  const setActiveCategory = useCallback((category: FileCategory) => {
    setActiveCategoryState(category);
    notifyAppEvent(AppEventName.CATEGORY_CHANGED, { category });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const value = useMemo<FilesContextValue>(
    () => ({
      files,
      loading,
      error,
      activeCategory,
      searchQuery,
      suggestions,
      duplicateGroups,
      similarGroups,
      selectFiles,
      loadSampleFiles,
      clearFiles,
      clearError,
      renameFile,
      deleteFile,
      acceptSuggestion,
      ignoreSuggestion,
      setActiveCategory,
      setSearchQuery,
    }),
    [
      files,
      loading,
      error,
      activeCategory,
      searchQuery,
      suggestions,
      duplicateGroups,
      similarGroups,
      selectFiles,
      loadSampleFiles,
      clearFiles,
      clearError,
      renameFile,
      deleteFile,
      acceptSuggestion,
      ignoreSuggestion,
      setActiveCategory,
      setSearchQuery,
    ],
  );

  return <FilesContext.Provider value={value}>{children}</FilesContext.Provider>;
}

export function useFiles(): FilesContextValue {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles deve ser usado dentro de FilesProvider");
  }
  return context;
}
