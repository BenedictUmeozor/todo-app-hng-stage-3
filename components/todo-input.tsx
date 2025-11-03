import { ActivityIndicator, Platform, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type TodoInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  colors: { sep: string; placeholder: string };
  isDark: boolean;
  isAdding: boolean;
};

export function TodoInput({ value, onChangeText, onSubmit, colors, isDark, isAdding }: TodoInputProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(100)}

      style={[styles.card, styles.shadowLight, isDark && styles.shadowDark]}>
      {isAdding ? (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
          <ActivityIndicator size="small" color={colors.placeholder} />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
          <View style={[styles.circle, { borderColor: colors.sep }]} />
        </Animated.View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Create a new todo…"
        placeholderTextColor={colors.placeholder}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        keyboardAppearance={isDark ? "dark" : "light"}
        editable={!isAdding}
        style={[styles.input, { color: isDark ? "#ECEDEE" : "#11181C" }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 48,
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  shadowLight: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(194,195,214,0.5)",
        shadowOffset: { width: 0, height: 35 },
        shadowOpacity: 1,
        shadowRadius: 50,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  shadowDark: {
    backgroundColor: "#25273D",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: { width: 0, height: 35 },
        shadowOpacity: 1,
        shadowRadius: 50,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: "JosefinSans-Regular",
    fontSize: 12,
    letterSpacing: -0.2,
    paddingVertical: Platform.select({ ios: 0, android: 0, default: 0 }),
  },
});
