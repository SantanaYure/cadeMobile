import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORY_LABELS } from "../constants/categories";
import { FILE_TYPE_LABELS } from "../constants/fileTypes";
import { colors, radius, spacing, typography } from "../theme";
import { AiSuggestion, FileItem } from "../types";
import { formatDate } from "../utils/formatDate";
import { formatFileSize } from "../utils/formatFileSize";
import { AiSuggestionCard } from "../components/ai/AiSuggestionCard";
import { AppIcon, type IconName } from "../components/ui/AppIcon";
import { Button } from "../components/ui/Button";

type FileDetailsSheetProps = {
  file: FileItem | null;
  suggestions: AiSuggestion[];
  relatedFiles: FileItem[];
  onClose: () => void;
  onRequestRename: (file: FileItem, newName: string) => void;
  onRequestDelete: (file: FileItem) => void;
  onAcceptSuggestion: (suggestion: AiSuggestion) => void;
  onIgnoreSuggestion: (suggestion: AiSuggestion) => void;
};

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaRow}>
      <AppIcon name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

type FileDetailsContentProps = Omit<FileDetailsSheetProps, "file"> & {
  file: FileItem;
};

function FileDetailsContent({
  file,
  suggestions,
  relatedFiles,
  onClose,
  onRequestRename,
  onRequestDelete,
  onAcceptSuggestion,
  onIgnoreSuggestion,
}: FileDetailsContentProps) {
  const [nameDraft, setNameDraft] = useState(file.name);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    setNameDraft(file.name);
  }, [file.name]);

  const canRename =
    nameDraft.trim().length > 0 && nameDraft.trim() !== file.name;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingBottom: bottom + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {file.name}
        </Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar detalhes"
          hitSlop={spacing.sm}
        >
          <AppIcon name="close" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.metaCard}>
        <MetaRow icon="shape-outline" label="Tipo" value={FILE_TYPE_LABELS[file.type]} />
        <MetaRow
          icon="folder-outline"
          label="Categoria"
          value={CATEGORY_LABELS[file.category]}
        />
        <MetaRow
          icon="weight"
          label="Tamanho"
          value={formatFileSize(file.size)}
        />
        <MetaRow
          icon="calendar-edit"
          label="Atualizado"
          value={formatDate(file.updatedAt)}
        />
        {file.createdAt ? (
          <MetaRow
            icon="calendar-plus"
            label="Criado"
            value={formatDate(file.createdAt)}
          />
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Renomear</Text>
        <TextInput
          value={nameDraft}
          onChangeText={setNameDraft}
          style={styles.input}
          autoCorrect={false}
          accessibilityLabel="Novo nome do arquivo"
        />
        <Button
          title="Renomear"
          variant="secondary"
          icon="pencil-outline"
          disabled={!canRename}
          onPress={() => onRequestRename(file, nameDraft)}
        />
      </View>

      {suggestions.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sugestões da IA</Text>
          {suggestions.map((suggestion) => (
            <AiSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              file={file}
              onAccept={onAcceptSuggestion}
              onIgnore={onIgnoreSuggestion}
            />
          ))}
        </View>
      ) : null}

      {relatedFiles.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Possíveis duplicatas relacionadas
          </Text>
          {relatedFiles.map((related) => (
            <View key={related.id} style={styles.relatedRow}>
              <AppIcon name="file-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.relatedName} numberOfLines={1}>
                {related.name}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <Button
        title="Excluir arquivo"
        variant="danger"
        icon="trash-can-outline"
        onPress={() => onRequestDelete(file)}
        style={styles.deleteButton}
      />
    </ScrollView>
  );
}

/**
 * Modal/bottom sheet com os detalhes do arquivo: metadados, renomear,
 * sugestões da IA e duplicatas relacionadas. Todas as ações sensíveis são
 * roteadas pelo fluxo de confirmação do chamador.
 */
export function FileDetailsSheet({ file, ...props }: FileDetailsSheetProps) {
  return (
    <Modal
      visible={file !== null}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={props.onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={props.onClose} />
        <View style={styles.sheet}>
          {file ? <FileDetailsContent file={file} {...props} /> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: "88%",
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.modal,
    borderTopRightRadius: radius.modal,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.smd,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  metaCard: {
    gap: spacing.smd,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  metaLabel: {
    ...typography.support,
    color: colors.textSecondary,
    width: 96,
  },
  metaValue: {
    ...typography.support,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "right",
  },
  section: {
    gap: spacing.smd,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.smd,
    paddingVertical: 0,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    ...typography.body,
  },
  relatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.smd,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
  },
  relatedName: {
    ...typography.support,
    color: colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    marginTop: spacing.sm,
  },
});
