import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { reorderItems } from "react-native-reorderable-list";
import Toast from "react-native-toast-message";

export function useTodos() {
  const todos = useQuery(api.todos.get);
  const isLoading = todos === undefined;
  const todosList = todos ?? [];

  const addTodoMutation = useMutation(api.todos.add);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const updateTodoMutation = useMutation(api.todos.update);
  const deleteTodoMutation = useMutation(api.todos.remove);
  const clearCompletedMutation = useMutation(api.todos.clearCompleted);
  const reorderMutation = useMutation(api.todos.reorder);

  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (todos === undefined && !isLoading) {
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Unable to load todos. Retrying...",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }, [todos, isLoading]);

  const handleError = (error: any, action: string) => {
    console.error(`Failed to ${action}:`, error);

    let message = `Failed to ${action}`;

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

  const clearCompleted = async () => {
    const completedCount = todosList.filter((t) => t.completed).length;

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
        text2: `${completedCount} completed ${completedCount === 1 ? "todo" : "todos"} removed`,
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error) {
      handleError(error, "clear completed todos");
    }
  };

  const handleReorder = async (filteredTodos: any[], { from, to }: { from: number; to: number }) => {
    try {
      const reordered = reorderItems(filteredTodos, from, to);
      const updates = reordered.map((todo, index) => ({
        id: todo._id as any,
        order: index,
      }));
      await reorderMutation({ updates });
    } catch (error) {
      handleError(error, "reorder todos");
    }
  };

  return {
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
  };
}
