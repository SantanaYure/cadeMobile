import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type AppIconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

/**
 * Wrapper único de ícones do app (Material Community Icons).
 * Centraliza a biblioteca de ícones para facilitar troca futura.
 */
export function AppIcon({
  name,
  size = 20,
  color = colors.textPrimary,
}: AppIconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
