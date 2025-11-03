import { api } from "@/convex/_generated/api";
import { useThemeController } from "@/hooks/theme-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReorderableList, { reorderItems, useReorderableDrag } from "react-native-reorderable-list";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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
  const todos = useQuery(api.todos.get);
  const isLoading = todos === undefined;
  const todosList = todos ?? [];
  
  // Show error toast if query fails (Convex will retry automatically)
  React.useEffect(() => {
    if (todos === undefined && !isLoading) {
      // This means the query failed after retries
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Unable to load todos. Retrying...",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }, [todos, isLoading]);
  
  const addTodoMutation = useMutation(api.todos.add);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const updateTodoMutation = useMutation(api.todos.update);
  const deleteTodoMutation = useMutation(api.todos.remove);
  const clearCompletedMutation = useMutation(api.todos.clearCompleted);
  const reorderMutation = useMutation(api.todos.reorder);

  const [text, setText] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">(
    "all"
  );
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);

  // Error handler helper
  const handleError = (error: any, action: string) => {
    console.error(`Failed to ${action}:`, error);
    
    let message = `Failed to ${action}`;
    
    // Check for specific error types
    if (error?.message) {
      if (error.message.includes("empty")) {
        message = "Todo text cannot be empty";
      } else if (error.message.includes("not found")) {
        message = "Todo not found. It may have been deleted.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        message = "Network error. Please check your connection.";
      } else {
        message = error.message;
      }
    } else if (error?.toString().includes("NetworkError")) {
      message = "Network error. Please check your connection.";
    }
    
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const addTodo = async () => {
    const value = text.trim();
    
    // Client-side validation
    if (!value) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a todo",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }
    
    if (value.length > 200) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Todo text is too long (max 200 characters)",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }
    
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      await addTodoMutation({ text: value });
      setText("");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Todo added",
        position: "top",
        visibilityTime: 1500,
      });
    } catch (error) {
      handleError(error, "add todo");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await toggleTodoMutation({ id: id as any });
    } catch (error) {
      handleError(error, "toggle todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoMutation({ id: id as any });
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Todo removed",
        position: "top",
        visibilityTime: 1500,
      });
    } catch (error) {
      handleError(error, "delete todo");
    }
  };

  const startEditing = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const value = editText.trim();
    
    // Client-side validation
    if (!value) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Todo text cannot be empty",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }
    
    if (value.length > 200) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Todo text is too long (max 200 characters)",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }
    
    try {
      await updateTodoMutation({ id: editingId as any, text: value });
      setEditingId(null);
      setEditText("");
      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Todo updated successfully",
        position: "top",
        visibilityTime: 1500,
      });
    } catch (error) {
      handleError(error, "update todo");
    }
  };

  const itemsLeft = todosList.filter(t => !t.completed).length;

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case "active":
        return todosList.filter(t => !t.completed);
      case "completed":
        return todosList.filter(t => t.completed);
      default:
        return todosList;
    }
  }, [filter, todosList]);

  const clearCompleted = async () => {
    const completedCount = todosList.filter(t => t.completed).length;
    
    if (completedCount === 0) {
      Toast.show({
        type: "info",
        text1: "No Completed Todos",
        text2: "There are no completed todos to clear",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }
    
    try {
      await clearCompletedMutation({});
      Toast.show({
        type: "success",
        text1: "Cleared",
        text2: `${completedCount} completed ${completedCount === 1 ? 'todo' : 'todos'} removed`,
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error) {
      handleError(error, "clear completed todos");
    }
  };

  const handleReorder = async ({ from, to }: { from: number; to: number }) => {
    try {
      // Reorder the filtered todos
      const reordered = reorderItems(filteredTodos, from, to);
      
      // Update order based on new positions
      const updates = reordered.map((todo, index) => ({
        id: todo._id as any,
        order: index,
      }));
      await reorderMutation({ updates });
    } catch (error) {
      handleError(error, "reorder todos");
    }
  };

  const renderItem = ({ item, index }: { item: typeof todosList[0]; index: number }) => {
    const isEditing = editingId === item._id;
    const showSeparator = index < filteredTodos.length - 1;

    return (
      <View>
        <TodoRow
          id={item._id}
          text={item.text}
          completed={item.completed}
          colors={colors}
          isDark={isDark}
          isEditing={isEditing}
          editText={editText}
          onEditTextChange={setEditText}
          onToggle={() => toggleTodo(item._id)}
          onDelete={() => deleteTodo(item._id)}
          onEdit={() => startEditing(item._id, item.text)}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEditing}
        />
        {showSeparator && <Separator color={colors.sep} />}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            {isAdding ? (
              <ActivityIndicator size="small" color={colors.placeholder} />
            ) : (
              <View style={[styles.circle, { borderColor: colors.sep }]} />
            )}
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Create a new todo…"
              placeholderTextColor={colors.placeholder}
              onSubmitEditing={addTodo}
              returnKeyType="done"
              keyboardAppearance={isDark ? "dark" : "light"}
              editable={!isAdding}
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
            {isLoading ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="hourglass-outline" 
                  size={48} 
                  color={colors.placeholder} 
                />
                <Text style={[styles.emptyText, { color: colors.placeholder }]}>
                  Loading your todos...
                </Text>
              </View>
            ) : filteredTodos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name={
                    filter === "completed" 
                      ? "checkmark-done-circle-outline"
                      : filter === "active"
                      ? "list-outline"
                      : "happy-outline"
                  } 
                  size={48} 
                  color={colors.placeholder} 
                />
                <Text style={[styles.emptyText, { color: colors.placeholder }]}>
                  {filter === "completed" 
                    ? "No completed todos yet"
                    : filter === "active"
                    ? "No active todos"
                    : "No todos yet. Add one above!"}
                </Text>
              </View>
            ) : (
              <ReorderableList
                data={filteredTodos}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                onReorder={handleReorder}
                scrollEnabled={false}
                ListFooterComponent={
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
                }
              />
            )}
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
            Long press and drag to reorder list
          </Text>
        </ScrollView>
      </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

function Separator({ color }: { color: string }) {
  return <View style={[styles.separator, { backgroundColor: color }]} />;
}

function TodoRow({
  id,
  text,
  completed = false,
  colors,
  isDark,
  isEditing,
  editText,
  onEditTextChange,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
}: {
  id: string;
  text: string;
  completed?: boolean;
  colors: { item: string; itemCompleted: string; sep: string; x: string };
  isDark: boolean;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (text: string) => void;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}) {
  const drag = useReorderableDrag();
  if (isEditing) {
    return (
      <View style={styles.row}>
        <TextInput
          value={editText}
          onChangeText={onEditTextChange}
          autoFocus
          onSubmitEditing={onSaveEdit}
          returnKeyType="done"
          keyboardAppearance={isDark ? "dark" : "light"}
          style={[
            styles.itemText,
            styles.editInput,
            { color: colors.item, borderColor: colors.sep },
          ]}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Save edit"
          onPress={onSaveEdit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="checkmark" size={16} color="#3A7CFD" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Cancel edit"
          onPress={onCancelEdit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={12} color={colors.x} />
        </TouchableOpacity>
      </View>
    );
  }

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
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onEdit}
        onLongPress={drag}
        disabled={completed}>
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
      </TouchableOpacity>
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
  editInput: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
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
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: {
    fontFamily: "JosefinSans-Regular",
    fontSize: 14,
    letterSpacing: -0.2,
    textAlign: "center",
  },
});
