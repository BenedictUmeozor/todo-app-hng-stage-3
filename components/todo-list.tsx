import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReorderableList from "react-native-reorderable-list";
import { TodoRow } from "./todo-row";

type Todo = {
  _id: string;
  text: string;
  completed: boolean;
};

type TodoListProps = {
  todos: Todo[];
  isLoading: boolean;
  filter: "all" | "active" | "completed";
  colors: any;
  isDark: boolean;
  itemsLeft: number;
  editingId: string | null;
  editText: string;
  onEditTextChange: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onReorder: (params: { from: number; to: number }) => void;
  onClearCompleted: () => void;
};

export function TodoList({
  todos,
  isLoading,
  filter,
  colors,
  isDark,
  itemsLeft,
  editingId,
  editText,
  onEditTextChange,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onReorder,
  onClearCompleted,
}: TodoListProps) {
  const renderItem = ({ item, index }: { item: Todo; index: number }) => {
    const isEditing = editingId === item._id;
    const showSeparator = index < todos.length - 1;

    return (
      <View>
        <TodoRow
          text={item.text}
          completed={item.completed}
          colors={colors}
          isDark={isDark}
          isEditing={isEditing}
          editText={editText}
          onEditTextChange={onEditTextChange}
          onToggle={() => onToggle(item._id)}
          onDelete={() => onDelete(item._id)}
          onEdit={() => onEdit(item._id, item.text)}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
        {showSeparator && <Separator color={colors.sep} />}
      </View>
    );
  };

  return (
    <View style={[styles.listCard, styles.shadowLight, isDark && styles.shadowDark]}>
      {isLoading ? (
        <EmptyState
          icon="hourglass-outline"
          text="Loading your todos..."
          color={colors.placeholder}
        />
      ) : todos.length === 0 ? (
        <EmptyState
          icon={
            filter === "completed"
              ? "checkmark-done-circle-outline"
              : filter === "active"
              ? "list-outline"
              : "happy-outline"
          }
          text={
            filter === "completed"
              ? "No completed todos yet"
              : filter === "active"
              ? "No active todos"
              : "No todos yet. Add one above!"
          }
          color={colors.placeholder}
        />
      ) : (
        <ReorderableList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onReorder={onReorder}
          scrollEnabled={false}
          ListFooterComponent={
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.placeholder }]}>
                {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
              </Text>
              <TouchableOpacity onPress={onClearCompleted}>
                <Text style={[styles.footerText, { color: colors.placeholder }]}>
                  Clear Completed
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

function Separator({ color }: { color: string }) {
  return <View style={[styles.separator, { backgroundColor: color }]} />;
}

function EmptyState({ icon, text, color }: { icon: any; text: string; color: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={48} color={color} />
      <Text style={[styles.emptyText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  separator: {
    height: 1,
    width: "100%",
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
