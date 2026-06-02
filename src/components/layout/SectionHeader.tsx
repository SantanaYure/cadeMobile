import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../theme";

type SectionHeaderProps = {
  title: string;
  count?: number;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  count,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  const showCount = typeof count === "number" && count > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
        {showCount ? ` (${count})` : ""}
      </Text>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          hitSlop={spacing.sm}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  action: {
    ...typography.label,
    color: colors.textSecondary,
  },
});
