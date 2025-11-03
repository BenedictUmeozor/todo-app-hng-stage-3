import { api } from "@/convex/_generated/api";
import { useThemeController } from "@/hooks/theme-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemeMode = "light" | "dark";

export default function HomeScreen() {
  const scheme = (useColorScheme() ?? "light") as ThemeMode;
  const { setScheme } = useThemeController();

  const isDark = scheme === "dark";
  const bgImage = isDark
    ? require("@/assets/images/background-dark.png")
    : require("@/assets/images/background-light.png");

  const colors = isDark
    ? {
        card: "#25273D",
        sep: "#393A4B",
        placeholder: "#767992",
        item: "#C8CBE7",
        itemCompleted: "#4D5067",
        hint: "#5B5E7E",
        x: "#5B5E7E",
      }
    : {
        card: "#FFFFFF",
        sep: "#E3E4F1",
        placeholder: "#9495A5",
        item: "#494C6B",
        itemCompleted: "#D1D2DA",
        hint: "#9495A5",
        x: "#9495A5",
      };

  // Convex hooks
  const todos = useQuery(api.todos.get) ?? [];
  const addTodoMutation = useMutation(api.todos.add);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const deleteTodoMutation = useMutation(api.todos.remove);
  const clearCompletedMutation = useMutation(api.todos.clearCompleted);

  const [text, setText] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">(
    "all"
  );

  const addTodo = async () => {
    const value = text.trim();
    if (!value) return;
    try {
      await addTodoMutation({ text: value });
      setText("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await toggleTodoMutation({ id: id as any });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoMutation({ id: id as any });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const itemsLeft = todos.filter(t => !t.completed).length;

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter(t => !t.completed);
      case "completed":
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const clearCompleted = async () => {
    try {
      await clearCompletedMutation({});
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: isDark ? "#171823" : "#FAFAFA" },
      ]}>
      <Image source={bgImage} style={styles.headerImage} contentFit="cover" />
      {/* Header Gradient Overlay */}
      <LinearGradient
        colors={["#5596FF", "#AC2DEB"]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.headerGradient}
        pointerEvents="none"
      />
      <SafeAreaView>
        <View style={styles.content}>
          {/* Header: TODO + theme toggle */}
          <View style={styles.headerRow}>
            <Text style={styles.logo}>TODO</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Toggle theme"
              onPress={() => setScheme(isDark ? "light" : "dark")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.spacer, { height: 48 }]} />

          {/* Input Bar */}
          <View
            style={[
              styles.card,
              styles.shadowLight,
              isDark && styles.shadowDark,
            ]}>
            <View style={[styles.circle, { borderColor: colors.sep }]} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Create a new todo…"
              placeholderTextColor={colors.placeholder}
              onSubmitEditing={addTodo}
              returnKeyType="done"
              keyboardAppearance={isDark ? "dark" : "light"}
              style={[styles.input, { color: isDark ? "#ECEDEE" : "#11181C" }]}
            />
          </View>

          {/* Todos List */}
          <View
            style={[
              styles.listCard,
              styles.shadowLight,
              isDark && styles.shadowDark,
            ]}>
            {filteredTodos.map((t, idx) => (
              <View key={t._id}>
                <Row
                  id={t._id}
                  text={t.text}
                  completed={t.completed}
                  colors={colors}
                  onToggle={() => toggleTodo(t._id)}
                  onDelete={() => deleteTodo(t._id)}
                />
                {idx < filteredTodos.length - 1 ? (
                  <Separator color={colors.sep} />
                ) : null}
              </View>
            ))}

            {/* Footer inside list */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.placeholder }]}>
                {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
              </Text>
              <TouchableOpacity onPress={clearCompleted}>
                <Text
                  style={[styles.footerText, { color: colors.placeholder }]}>
                  Clear Completed
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filters card */}
          <View
            style={[
              styles.filtersCard,
              styles.shadowLight,
              isDark && styles.shadowDark,
            ]}>
            <TouchableOpacity onPress={() => setFilter("all")}>
              <Text
                style={[
                  styles.filter,
                  filter === "all"
                    ? styles.filterActive
                    : { color: colors.placeholder },
                ]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter("active")}>
              <Text
                style={[
                  styles.filter,
                  filter === "active"
                    ? styles.filterActive
                    : { color: colors.placeholder },
                ]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter("completed")}>
              <Text
                style={[
                  styles.filter,
                  filter === "completed"
                    ? styles.filterActive
                    : { color: colors.placeholder },
                ]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hint */}
          <Text style={[styles.hint, { color: colors.hint }]}>
            Drag and drop to reorder list
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Separator({ color }: { color: string }) {
  return <View style={[styles.separator, { backgroundColor: color }]} />;
}

function Row({
  id,
  text,
  completed = false,
  colors,
  onToggle,
  onDelete,
}: {
  id: string;
  text: string;
  completed?: boolean;
  colors: { item: string; itemCompleted: string; sep: string; x: string };
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={completed ? "Mark as active" : "Mark as completed"}
        onPress={onToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        {completed ? (
          <LinearGradient
            colors={["#5596FF", "#AC2DEB"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.checkbox}>
            <Ionicons name="checkmark-sharp" size={14} color="#FFFFFF" />
          </LinearGradient>
        ) : (
          <View style={[styles.circle, { borderColor: colors.sep }]} />
        )}
      </TouchableOpacity>
      <Text
        numberOfLines={2}
        style={[
          styles.itemText,
          completed
            ? {
                color: colors.itemCompleted,
                textDecorationLine: "line-through",
              }
            : { color: colors.item },
        ]}>
        {text}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Delete ${text}`}
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={12} color={colors.x} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    width: "100%",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    width: "100%",
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: 24,
  },
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
  spacer: {
    width: "100%",
  },
  card: {
    height: 48,
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  listCard: {
    marginTop: 24,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
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
  placeholder: {
    fontFamily: "JosefinSans-Regular",
    fontSize: 12,
    letterSpacing: -0.2,
  },
  input: {
    flex: 1,
    fontFamily: "JosefinSans-Regular",
    fontSize: 12,
    letterSpacing: -0.2,
    paddingVertical: Platform.select({ ios: 0, android: 0, default: 0 }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "transparent",
  },
  separator: {
    height: 1,
    width: "100%",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    flex: 1,
    fontFamily: "JosefinSans-Regular",
    fontSize: 12,
    letterSpacing: -0.2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footerText: {
    fontFamily: "JosefinSans-Regular",
    fontSize: 12,
    letterSpacing: -0.2,
  },
  filtersCard: {
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 24,
  },
  filter: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 14,
    letterSpacing: -0.2,
  },
  filterActive: {
    color: "#3A7CFD",
  },
  hint: {
    textAlign: "center",
    marginTop: 24,
    fontFamily: "JosefinSans-Regular",
    fontSize: 14,
    letterSpacing: -0.2,
  },
});
