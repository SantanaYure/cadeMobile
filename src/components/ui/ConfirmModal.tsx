import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing, typography } from "../../theme";
import { ConfirmationVariant } from "../../types";
import { Button } from "./Button";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmationVariant;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Modal genérico de confirmação de ações sensíveis.
 * Mostra título, o que muda e botões cancelar/confirmar.
 */
export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              style={styles.action}
            />
            <Button
              title={confirmLabel}
              variant={variant === "danger" ? "danger" : "primary"}
              onPress={onConfirm}
              style={styles.action}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    gap: spacing.smd,
    padding: spacing.lg,
    borderRadius: radius.modal,
    backgroundColor: colors.white,
    ...shadows.modal,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.smd,
    marginTop: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
