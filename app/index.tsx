import { FilterTabs } from "@/components/filter-tabs";
import { Header } from "@/components/header";
import { TodoInput } from "@/components/todo-input";
import { TodoList } from "@/components/todo-list";
import { useThemeController } from "@/hooks/theme-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodos } from "@/hooks/use-todos";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemeMode = "light" | "dark";
type Todo = { _id: string; text: string; completed: boolean };

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

  const {
    todosList,
    isLoading,
    text,
    setText,
    filter,
    setFilter,
    editingId,
    editText,
    setEditText,
    isAdding,
    addTodo,
    toggleTodo,
    deleteTodo,
    startEditing,
    cancelEditing,
    saveEdit,
    clearCompleted,
    handleReorder,
  } = useTodos();

  const itemsLeft = todosList.filter((t: Todo) => !t.completed).length;

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case "active":
        return todosList.filter((t: Todo) => !t.completed);
      case "completed":
        return todosList.filter((t: Todo) => t.completed);
      default:
        return todosList;
    }
  }, [filter, todosList]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.screen, { backgroundColor: isDark ? "#171823" : "#FAFAFA" }]}>
        <Image source={bgImage} style={styles.headerImage} contentFit="cover" />
        <LinearGradient
          colors={["#5596FF", "#AC2DEB"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.headerGradient}
          pointerEvents="none"
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Header isDark={isDark} onToggleTheme={() => setScheme(isDark ? "light" : "dark")} />
            <View style={[styles.spacer, { height: 48 }]} />

            <TodoInput
              value={text}
              onChangeText={setText}
              onSubmit={addTodo}
              colors={colors}
              isDark={isDark}
              isAdding={isAdding}
            />

            <TodoList
              todos={filteredTodos}
              isLoading={isLoading}
              filter={filter}
              colors={colors}
              isDark={isDark}
              itemsLeft={itemsLeft}
              editingId={editingId}
              editText={editText}
              onEditTextChange={setEditText}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEditing}
              onReorder={(params: { from: number; to: number }) => handleReorder(filteredTodos, params)}
              onClearCompleted={clearCompleted}
            />

            <FilterTabs
              filter={filter}
              onFilterChange={setFilter}
              colors={colors}
              isDark={isDark}
            />

            <Text style={[styles.hint, { color: colors.hint }]}>
              Long press and drag to reorder list
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
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
  spacer: {
    width: "100%",
  },
  hint: {
    textAlign: "center",
    marginTop: 24,
    fontFamily: "JosefinSans-Regular",
    fontSize: 14,
    letterSpacing: -0.2,
  },
});
