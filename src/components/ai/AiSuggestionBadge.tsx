import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { AiSuggestionStatus } from "../../types";
import { AppIcon, type IconName } from "../ui/AppIcon";

type AiSuggestionBadgeProps = {
  status?: AiSuggestionStatus;
};

const STATUS_CONFIG: Record<
  AiSuggestionStatus,
  { label: string; background: string; color: string; icon: IconName }
> = {
  pending: {
    label: "Sugestão da IA",
    background: colors.aiSurfaceSoft,
    color: colors.textPrimary,
    icon: "robot-outline",
  },
  accepted: {
    label: "Aplicada",
    background: colors.successSoft,
    color: colors.success,
    icon: "check-circle-outline",
  },
  ignored: {
    label: "Ignorada",
    background: colors.neutral,
    color: colors.textSecondary,
    icon: "close-circle-outline",
  },
};

export function AiSuggestionBadge({ status = "pending" }: AiSuggestionBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <AppIcon name={config.icon} size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
  },
  label: {
    ...typography.caption,
  },
});
