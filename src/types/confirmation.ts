/**
 * Pedido de confirmação para ações sensíveis (renomear, excluir, aceitar/ignorar sugestão).
 * Mostra o que muda, qual arquivo é afetado e se a ação é reversível.
 */
export type ConfirmationVariant = "default" | "danger";

export type ConfirmationRequest = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: ConfirmationVariant;
  onConfirm: () => void;
};
