import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../theme";
import { AppIcon, type IconName } from "./AppIcon";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon = "folder-search-outline",
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <AppIcon name={icon} size={32} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.smd,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral,
  },
  title: {
    ...typography.emptyState,
    color: colors.textPrimary,
    textAlign: "center",
  },
  description: {
    ...typography.support,
    color: colors.textSecondary,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.sm,
    alignSelf: "stretch",
    gap: spacing.sm,
  },
});
