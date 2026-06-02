import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { AppIcon } from "./AppIcon";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar arquivos, categorias ou sugestões da IA",
}: SearchInputProps) {
  return (
    <View style={styles.container}>
      <AppIcon name="magnify" size={20} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Buscar arquivos"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.smd,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.textPrimary,
    ...typography.body,
  },
});
