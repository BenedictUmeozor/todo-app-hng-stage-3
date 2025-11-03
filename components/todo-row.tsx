import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useReorderableDrag } from "react-native-reorderable-list";

type TodoRowProps = {
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
};

export function TodoRow({
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
}: TodoRowProps) {
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "transparent",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
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
});
