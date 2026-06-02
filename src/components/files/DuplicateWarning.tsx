import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { AppIcon } from "../ui/AppIcon";

type DuplicateWarningProps = {
  count: number;
  onPress?: () => void;
};

/**
 * Aviso de arquivos com nomes muito parecidos / possíveis duplicatas.
 * Linguagem assistiva, com ícone + texto (não depende só de cor).
 */
export function DuplicateWarning({ count, onPress }: DuplicateWarningProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <AppIcon name="alert-outline" size={20} color={colors.warning} />
      <View style={styles.text}>
        <Text style={styles.title}>
          Encontramos arquivos com nomes muito parecidos.
        </Text>
        <Text style={styles.subtitle}>
          {count} {count === 1 ? "grupo" : "grupos"} de possíveis duplicatas.
          Toque para revisar.
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.smd,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  pressed: {
    opacity: 0.9,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.support,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
