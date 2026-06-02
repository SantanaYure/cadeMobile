/**
 * Tokens de cor do Cadê?.
 * Valores definidos em `.claude/cade-design-guide.md`.
 * Componentes nunca devem usar valores hexadecimais diretamente.
 */
export const colors = {
  background: "#FEFEFE",
  surface: "#FEFEFE",
  white: "#FEFEFE",

  textPrimary: "#511E01",
  textSecondary: "#7A6F66",

  primary: "#FED809",
  onPrimary: "#511E01",

  aiAccent: "#D3E601",
  aiSurfaceSoft: "#F4FAC9",

  neutral: "#E5E2DC",

  danger: "#D92D20",
  dangerSoft: "#FBEAE9",
  warning: "#F79009",
  warningSoft: "#FDF1E4",
  success: "#12B76A",
  successSoft: "#E7F7EF",

  overlay: "rgba(40, 22, 8, 0.45)",
} as const;

export type AppColor = keyof typeof colors;
