import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}

      style={styles.headerRow}>
      <Text style={styles.logo}>TODO</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Toggle theme"
        onPress={onToggleTheme}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name={isDark ? "sunny" : "moon"} size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "#FFFFFF",
    fontFamily: "JosefinSans-Bold",
    fontSize: 20,
    letterSpacing: 8,
  },
});
