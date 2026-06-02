import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { AppIcon, type IconName } from "./AppIcon";

type CategoryChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: IconName;
  count?: number;
};

export function CategoryChip({
  label,
  active,
  onPress,
  icon,
  count,
}: CategoryChipProps) {
  const contentColor = active ? colors.onPrimary : colors.textPrimary;
  const showCount = typeof count === "number" && count > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <AppIcon name={icon} size={16} color={contentColor} /> : null}
      <Text style={[styles.label, { color: contentColor }]} numberOfLines={1}>
        {label}
        {showCount ? ` (${count})` : ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.smd,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.white,
    borderColor: colors.neutral,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.label,
  },
});
