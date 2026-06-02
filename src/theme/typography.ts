import { TextStyle } from "react-native";
import { fontFamily } from "./fonts";

/**
 * Tokens de tipografia do Cadê?.
 * Inter para títulos/ações/labels; Nunito Sans para textos de apoio.
 * Definidos em `.claude/cade-design-guide.md`.
 */
export const typography = {
  title: { fontFamily: fontFamily.interBold, fontSize: 28 },
  sectionTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 22 },
  cardTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 16 },
  button: { fontFamily: fontFamily.interSemiBold, fontSize: 15 },
  label: { fontFamily: fontFamily.interMedium, fontSize: 14 },
  body: { fontFamily: fontFamily.nunitoRegular, fontSize: 15 },
  support: { fontFamily: fontFamily.nunitoRegular, fontSize: 14 },
  emptyState: { fontFamily: fontFamily.nunitoRegular, fontSize: 16 },
  caption: { fontFamily: fontFamily.nunitoRegular, fontSize: 12 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
