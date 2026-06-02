import { type ReactNode } from "react";
import {
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../theme";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Container base das telas. Aplica fundo, barra de status e um respiro superior
 * no Android (via StatusBar.currentHeight) sem depender de lib de safe area.
 */
export function Screen({ children, style }: ScreenProps) {
  return (
    <View style={[styles.screen, style]}>
      <StatusBar style="dark" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: RNStatusBar.currentHeight ?? 0,
  },
});
