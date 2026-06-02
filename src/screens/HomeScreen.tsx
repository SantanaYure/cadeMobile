import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { APP_NAME, APP_TAGLINE } from "../constants/appInfo";
import { CATEGORIES, CATEGORY_LABELS } from "../constants/categories";
import { colors, radius, spacing, typography } from "../theme";
import { AiSuggestion, AiSuggestionStatus, FileCategory, FileItem } from "../types";
import { useAiSuggestions } from "../hooks/useAiSuggestions";
import { useConfirmation } from "../hooks/useConfirmation";
import { useFileSearch } from "../hooks/useFileSearch";
import { useFiles } from "../hooks/useFiles";
import { AiSuggestionCard } from "../components/ai/AiSuggestionCard";
import { DuplicateWarning } from "../components/files/DuplicateWarning";
import { FileList } from "../components/files/FileList";
import { AppIcon } from "../components/ui/AppIcon";
import { Button } from "../components/ui/Button";
import { CategoryChip } from "../components/ui/CategoryChip";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { SearchInput } from "../components/ui/SearchInput";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/layout/SectionHeader";
import { FileDetailsSheet } from "./FileDetailsSheet";

const MAX_HEADER_SUGGESTIONS = 3;

function sectionTitleForCategory(category: FileCategory): string {
  switch (category) {
    case "all":
      return "Arquivos recentes";
    case "aiSuggestions":
      return "Arquivos com sugestões";
    case "duplicates":
      return "Possíveis duplicatas";
    default:
      return CATEGORY_LABELS[category];
  }
}

function buildAcceptMessage(
  suggestion: AiSuggestion,
  file: FileItem | undefined,
): string {
  const fileName = file?.name ?? "o arquivo";
  switch (suggestion.kind) {
    case "category": {
      const label = suggestion.suggestedCategory
        ? CATEGORY_LABELS[suggestion.suggestedCategory]
        : "";
      return `"${fileName}" será movido para a categoria "${label}". Você pode mudar depois.`;
    }
    case "rename":
      return `"${fileName}" passará a se chamar "${suggestion.suggestedName ?? ""}". Você pode renomear novamente depois.`;
    case "duplicate":
      return "A sugestão será marcada como vista. Nenhum arquivo será excluído automaticamente.";
    case "newerVersion":
      return "A sugestão será marcada como vista. Nenhum arquivo será alterado automaticamente.";
    default:
      return "";
  }
}

export function HomeScreen() {
  const {
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
  } = useFiles();

  const results = useFileSearch();
  const { pendingSuggestions } = useAiSuggestions();
  const { pendingConfirmation, requestConfirmation, confirm, cancel } =
    useConfirmation();

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const selectedFile = useMemo(
    () => files.find((file) => file.id === selectedFileId) ?? null,
    [files, selectedFileId],
  );

  const duplicateFileIds = useMemo(() => {
    const ids = new Set<string>();
    duplicateGroups.forEach((group) =>
      group.fileIds.forEach((id) => ids.add(id)),
    );
    return ids;
  }, [duplicateGroups]);

  const suggestionStatusByFileId = useMemo(() => {
    const map: Record<string, AiSuggestionStatus> = {};
    pendingSuggestions.forEach((suggestion) => {
      map[suggestion.fileId] = "pending";
    });
    return map;
  }, [pendingSuggestions]);

  const selectedFileSuggestions = useMemo(
    () =>
      selectedFile
        ? suggestions.filter(
            (suggestion) =>
              suggestion.fileId === selectedFile.id &&
              suggestion.status === "pending",
          )
        : [],
    [selectedFile, suggestions],
  );

  const selectedRelatedFiles = useMemo(() => {
    if (!selectedFile) {
      return [];
    }
    const relatedIds = new Set<string>();
    [...duplicateGroups, ...similarGroups].forEach((group) => {
      if (group.fileIds.includes(selectedFile.id)) {
        group.fileIds.forEach((id) => {
          if (id !== selectedFile.id) {
            relatedIds.add(id);
          }
        });
      }
    });
    return files.filter((file) => relatedIds.has(file.id));
  }, [selectedFile, duplicateGroups, similarGroups, files]);

  const countForCategory = (category: FileCategory): number | undefined => {
    switch (category) {
      case "all":
        return files.length;
      case "duplicates":
        return duplicateFileIds.size;
      case "aiSuggestions":
        return Object.keys(suggestionStatusByFileId).length;
      default: {
        const count = files.filter((file) => file.category === category).length;
        return count > 0 ? count : undefined;
      }
    }
  };

  const handleAcceptSuggestion = (suggestion: AiSuggestion) => {
    const file = files.find((item) => item.id === suggestion.fileId);
    requestConfirmation({
      title: "Aplicar sugestão da IA?",
      message: buildAcceptMessage(suggestion, file),
      confirmLabel: "Aplicar",
      variant: "default",
      onConfirm: () => acceptSuggestion(suggestion),
    });
  };

  const handleIgnoreSuggestion = (suggestion: AiSuggestion) => {
    requestConfirmation({
      title: "Ignorar sugestão?",
      message:
        "A sugestão será ocultada. Você pode revisar os arquivos novamente depois.",
      confirmLabel: "Ignorar",
      variant: "default",
      onConfirm: () => ignoreSuggestion(suggestion.id),
    });
  };

  const handleRequestDelete = (file: FileItem) => {
    requestConfirmation({
      title: "Excluir arquivo?",
      message: `O arquivo "${file.name}" será removido da lista. Esta ação não pode ser desfeita nesta versão.`,
      confirmLabel: "Excluir",
      variant: "danger",
      onConfirm: () => {
        deleteFile(file.id);
        setSelectedFileId(null);
      },
    });
  };

  const handleRequestRename = (file: FileItem, newName: string) => {
    const trimmed = newName.trim();
    if (trimmed.length === 0 || trimmed === file.name) {
      return;
    }
    requestConfirmation({
      title: "Renomear arquivo?",
      message: `"${file.name}" passará a se chamar "${trimmed}". Você pode renomear novamente depois.`,
      confirmLabel: "Renomear",
      variant: "default",
      onConfirm: () => renameFile(file.id, trimmed),
    });
  };

  const handleRequestClear = () => {
    requestConfirmation({
      title: "Limpar lista?",
      message:
        "Todos os arquivos serão removidos da lista do app. Você pode adicioná-los novamente depois.",
      confirmLabel: "Limpar",
      variant: "danger",
      onConfirm: clearFiles,
    });
  };

  const showAllSections = activeCategory === "all";
  const headerSuggestions = pendingSuggestions.slice(0, MAX_HEADER_SUGGESTIONS);
  const hasMoreSuggestions = pendingSuggestions.length > headerSuggestions.length;

  const listHeader = (
    <View style={styles.header}>
      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorTextRow}>
            <AppIcon
              name="alert-circle-outline"
              size={20}
              color={colors.danger}
            />
            <Text style={styles.errorText}>{error.userMessage}</Text>
          </View>
          <Button title="Dispensar" variant="secondary" onPress={clearError} />
        </View>
      ) : null}

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      </View>

      <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
      >
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.label}
            icon={category.icon}
            active={activeCategory === category.id}
            count={countForCategory(category.id)}
            onPress={() => setActiveCategory(category.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title="Selecionar arquivos"
          icon="file-plus-outline"
          onPress={() => void selectFiles()}
          style={styles.actionButton}
        />
        <Button
          title="Carregar exemplos"
          variant="secondary"
          icon="folder-multiple-outline"
          onPress={loadSampleFiles}
          style={styles.actionButton}
        />
      </View>

      {files.length > 0 ? (
        <Pressable
          onPress={handleRequestClear}
          accessibilityRole="button"
          hitSlop={spacing.sm}
          style={styles.clearButton}
        >
          <AppIcon name="broom" size={16} color={colors.textSecondary} />
          <Text style={styles.clearText}>Limpar lista</Text>
        </Pressable>
      ) : null}

      {showAllSections && headerSuggestions.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Sugestões da IA"
            count={pendingSuggestions.length}
            actionLabel={hasMoreSuggestions ? "Ver todas" : undefined}
            onActionPress={
              hasMoreSuggestions
                ? () => setActiveCategory("aiSuggestions")
                : undefined
            }
          />
          {headerSuggestions.map((suggestion) => (
            <AiSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              file={files.find((file) => file.id === suggestion.fileId)}
              onAccept={handleAcceptSuggestion}
              onIgnore={handleIgnoreSuggestion}
            />
          ))}
        </View>
      ) : null}

      {results.length > 0 ? (
        <SectionHeader
          title={sectionTitleForCategory(activeCategory)}
          count={results.length}
        />
      ) : null}
    </View>
  );

  const listFooter = showAllSections ? (
    <View style={styles.footer}>
      {duplicateGroups.length > 0 ? (
        <DuplicateWarning
          count={duplicateGroups.length}
          onPress={() => setActiveCategory("duplicates")}
        />
      ) : null}

      {pendingSuggestions.length > 0 ? (
        <View style={styles.batchBar}>
          <View style={styles.batchTextRow}>
            <AppIcon
              name="checkbox-multiple-marked-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text style={styles.batchText}>
              {pendingSuggestions.length} sugestões pendentes
            </Text>
          </View>
          <Button
            title="Aplicar em lote (em breve)"
            variant="secondary"
            disabled
            onPress={() => undefined}
          />
        </View>
      ) : null}
    </View>
  ) : null;

  const listEmpty = loading ? (
    <LoadingSkeleton />
  ) : (
    <EmptyState
      icon={files.length === 0 ? "folder-plus-outline" : "file-search-outline"}
      title={
        files.length === 0
          ? "Nenhum arquivo por aqui ainda."
          : "Nada encontrado."
      }
      description={
        files.length === 0
          ? 'Selecione arquivos ou toque em "Carregar exemplos" para começar.'
          : "Tente outra busca ou outra categoria."
      }
    />
  );

  return (
    <Screen>
      <FileList
        files={results}
        onFilePress={(file) => setSelectedFileId(file.id)}
        duplicateFileIds={duplicateFileIds}
        suggestionStatusByFileId={suggestionStatusByFileId}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.listContent}
      />

      <FileDetailsSheet
        file={selectedFile}
        suggestions={selectedFileSuggestions}
        relatedFiles={selectedRelatedFiles}
        onClose={() => setSelectedFileId(null)}
        onRequestRename={handleRequestRename}
        onRequestDelete={handleRequestDelete}
        onAcceptSuggestion={handleAcceptSuggestion}
        onIgnoreSuggestion={handleIgnoreSuggestion}
      />

      <ConfirmModal
        visible={pendingConfirmation !== null}
        title={pendingConfirmation?.title ?? ""}
        message={pendingConfirmation?.message ?? ""}
        confirmLabel={pendingConfirmation?.confirmLabel ?? "Confirmar"}
        variant={pendingConfirmation?.variant ?? "default"}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  header: {
    gap: spacing.lg,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  tagline: {
    ...typography.support,
    color: colors.textSecondary,
  },
  chips: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.smd,
  },
  actionButton: {
    flex: 1,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
  },
  clearText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.smd,
  },
  footer: {
    gap: spacing.smd,
    paddingTop: spacing.smd,
  },
  batchBar: {
    gap: spacing.smd,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
  },
  batchTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  batchText: {
    ...typography.support,
    color: colors.textSecondary,
  },
  errorCard: {
    gap: spacing.smd,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  errorTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  errorText: {
    ...typography.support,
    color: colors.textPrimary,
    flex: 1,
  },
});
