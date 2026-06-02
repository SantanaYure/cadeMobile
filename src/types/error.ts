/**
 * Erro do app: mensagem clara para o usuário separada do detalhe técnico.
 */
export type AppError = {
  userMessage: string;
  technicalMessage?: string;
  code?: string;
};
