import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { AppIcon, type IconName } from "./AppIcon";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const VARIANT_STYLES: Record<
  ButtonVariant,
  { background: string; text: string; border: string; borderWidth: number }
> = {
  primary: {
    background: colors.primary,
    text: colors.onPrimary,
    border: colors.primary,
    borderWidth: 0,
  },
  secondary: {
    background: colors.white,
    text: colors.textPrimary,
    border: colors.neutral,
    borderWidth: 1,
  },
  danger: {
    background: colors.danger,
    text: colors.white,
    border: colors.danger,
    borderWidth: 0,
  },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const palette = VARIANT_STYLES[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderWidth: palette.borderWidth,
        },
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <AppIcon name={icon} size={18} color={palette.text} /> : null}
      <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.button,
  },
});
