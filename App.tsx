import { useFonts } from "expo-font";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConfirmationProvider } from "./src/hooks/useConfirmation";
import { FilesProvider } from "./src/hooks/useFiles";
import { HomeScreen } from "./src/screens/HomeScreen";
import { appFonts, colors } from "./src/theme";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ ...appFonts });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ConfirmationProvider>
        <FilesProvider>
          <HomeScreen />
        </FilesProvider>
      </ConfirmationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
