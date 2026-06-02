import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
} from "@expo-google-fonts/nunito-sans";

/**
 * Mapa de fontes carregado uma única vez no boot (App.tsx via `useFonts`).
 * As chaves são os nomes de família usados em `fontFamily`.
 */
export const appFonts = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
} as const;

/**
 * Nomes das famílias para uso nos tokens de tipografia.
 */
export const fontFamily = {
  interRegular: "Inter_400Regular",
  interMedium: "Inter_500Medium",
  interSemiBold: "Inter_600SemiBold",
  interBold: "Inter_700Bold",
  nunitoRegular: "NunitoSans_400Regular",
  nunitoSemiBold: "NunitoSans_600SemiBold",
} as const;
