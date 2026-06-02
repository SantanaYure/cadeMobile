import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors, radius, shadows, spacing } from "../../theme";

type LoadingSkeletonProps = {
  count?: number;
};

/**
 * Esqueleto de carregamento com cards pulsando (em vez de spinner),
 * conforme o guia de design.
 */
export function LoadingSkeleton({ count = 4 }: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View key={index} style={[styles.card, { opacity }]}>
          <View style={styles.icon} />
          <View style={styles.lines}>
            <View style={[styles.line, styles.lineWide]} />
            <View style={[styles.line, styles.lineNarrow]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.smd,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.smd,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.neutral,
  },
  lines: {
    flex: 1,
    gap: spacing.sm,
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.neutral,
  },
  lineWide: {
    width: "70%",
  },
  lineNarrow: {
    width: "40%",
  },
});
