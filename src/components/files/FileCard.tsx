import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_LABELS } from "../../constants/categories";
import { FILE_TYPE_ICONS, FILE_TYPE_LABELS } from "../../constants/fileTypes";
import { colors, radius, shadows, spacing, typography } from "../../theme";
import { AiSuggestionStatus, FileItem } from "../../types";
import { formatDate } from "../../utils/formatDate";
import { formatFileSize } from "../../utils/formatFileSize";
import { AiSuggestionBadge } from "../ai/AiSuggestionBadge";
import { AppIcon } from "../ui/AppIcon";

type FileCardProps = {
  file: FileItem;
  onPress: (file: FileItem) => void;
  isDuplicate?: boolean;
  suggestionStatus?: AiSuggestionStatus;
};

export function FileCard({
  file,
  onPress,
  isDuplicate = false,
  suggestionStatus,
}: FileCardProps) {
  const showBadges = isDuplicate || suggestionStatus !== undefined;

  return (
    <Pressable
      onPress={() => onPress(file)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${file.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <AppIcon
          name={FILE_TYPE_ICONS[file.type]}
          size={24}
          color={colors.textPrimary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {FILE_TYPE_LABELS[file.type]} · {CATEGORY_LABELS[file.category]}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatFileSize(file.size)} · {formatDate(file.updatedAt)}
        </Text>

        {showBadges ? (
          <View style={styles.badges}>
            {isDuplicate ? (
              <View style={styles.duplicateBadge}>
                <AppIcon name="content-copy" size={12} color={colors.warning} />
                <Text style={styles.duplicateText}>Possível duplicata</Text>
              </View>
            ) : null}
            {suggestionStatus ? (
              <AiSuggestionBadge status={suggestionStatus} />
            ) : null}
          </View>
        ) : null}
      </View>

      <AppIcon name="chevron-right" size={22} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.smd,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  duplicateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
    backgroundColor: colors.warningSoft,
  },
  duplicateText: {
    ...typography.caption,
    color: colors.warning,
  },
});
