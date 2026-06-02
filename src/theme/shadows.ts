import { Platform, ViewStyle } from "react-native";
import { colors } from "./colors";

/**
 * Sombras suaves do Cadê?.
 * No Android usa `elevation`; nas demais plataformas, propriedades `shadow*`.
 */
type ShadowTokens = {
  card: ViewStyle;
  modal: ViewStyle;
};

export const shadows: ShadowTokens = {
  card:
    Platform.OS === "android"
      ? { elevation: 2 }
      : {
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
  modal:
    Platform.OS === "android"
      ? { elevation: 8 }
      : {
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
};
