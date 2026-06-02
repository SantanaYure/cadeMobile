/**
 * Tokens de borda (raio) do Cadê?.
 * Definidos em `.claude/cade-design-guide.md`.
 */
export const radius = {
  card: 16,
  button: 12,
  input: 14,
  chip: 999,
  modal: 20,
} as const;

export type Radius = keyof typeof radius;
