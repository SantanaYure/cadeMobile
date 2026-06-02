import { StyleSheet, Text, View } from "react-native";
import { CATEGORY_LABELS } from "../../constants/categories";
import { colors, radius, spacing, typography } from "../../theme";
import { AiSuggestion, AiSuggestionKind, FileItem } from "../../types";
import { Button } from "../ui/Button";
import { AppIcon } from "../ui/AppIcon";

type AiSuggestionCardProps = {
  suggestion: AiSuggestion;
  file?: FileItem;
  onAccept: (suggestion: AiSuggestion) => void;
  onIgnore: (suggestion: AiSuggestion) => void;
};

const KIND_LABELS: Record<AiSuggestionKind, string> = {
  category: "Categoria",
  rename: "Renomear",
  duplicate: "Duplicata",
  newerVersion: "Versão",
};

function buildPreview(suggestion: AiSuggestion): string {
  switch (suggestion.kind) {
    case "category":
      return suggestion.suggestedCategory
        ? `Categoria sugerida: ${CATEGORY_LABELS[suggestion.suggestedCategory]}`
        : "Categoria sugerida.";
    case "rename":
      return `Novo nome sugerido: ${suggestion.suggestedName ?? ""}`;
    case "duplicate":
      return "Pode ser uma cópia de outro arquivo.";
    case "newerVersion":
      return "Pode ser a versão mais recente entre arquivos parecidos.";
    default:
      return "";
  }
}

function buildAcceptLabel(kind: AiSuggestionKind): string {
  return kind === "category" || kind === "rename"
    ? "Revisar e aplicar"
    : "Marcar como vista";
}

/**
 * Card de sugestão da IA (simulada). Linguagem assistiva e ações sempre sujeitas
 * à confirmação do usuário (o aceite/ignorar é roteado pelo fluxo de confirmação).
 */
export function AiSuggestionCard({
  suggestion,
  file,
  onAccept,
  onIgnore,
}: AiSuggestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppIcon name="robot-outline" size={18} color={colors.textPrimary} />
        <Text style={styles.headerTitle}>Sugestão da IA</Text>
        <View style={styles.kindTag}>
          <Text style={styles.kindLabel}>{KIND_LABELS[suggestion.kind]}</Text>
        </View>
      </View>

      {file ? (
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
      ) : null}

      <Text style={styles.preview}>{buildPreview(suggestion)}</Text>
      <Text style={styles.reason}>{suggestion.reason}</Text>

      <View style={styles.actions}>
        <Button
          title="Ignorar"
          variant="secondary"
          onPress={() => onIgnore(suggestion)}
          style={styles.action}
        />
        <Button
          title={buildAcceptLabel(suggestion.kind)}
          variant="primary"
          onPress={() => onAccept(suggestion)}
          style={styles.action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.aiSurfaceSoft,
    borderLeftWidth: 4,
    borderLeftColor: colors.aiAccent,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.label,
    color: colors.textPrimary,
    flex: 1,
  },
  kindTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
    backgroundColor: colors.white,
  },
  kindLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fileName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  preview: {
    ...typography.support,
    color: colors.textPrimary,
  },
  reason: {
    ...typography.support,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.smd,
    marginTop: spacing.xs,
  },
  action: {
    flex: 1,
  },
});
