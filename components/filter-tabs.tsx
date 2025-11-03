import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FilterTabsProps = {
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  colors: { placeholder: string };
  isDark: boolean;
};

export function FilterTabs({ filter, onFilterChange, colors, isDark }: FilterTabsProps) {
  return (
    <View style={[styles.filtersCard, styles.shadowLight, isDark && styles.shadowDark]}>
      <TouchableOpacity onPress={() => onFilterChange("all")}>
        <Text
          style={[
            styles.filter,
            filter === "all" ? styles.filterActive : { color: colors.placeholder },
          ]}>
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onFilterChange("active")}>
        <Text
          style={[
            styles.filter,
            filter === "active" ? styles.filterActive : { color: colors.placeholder },
          ]}>
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onFilterChange("completed")}>
        <Text
          style={[
            styles.filter,
            filter === "completed" ? styles.filterActive : { color: colors.placeholder },
          ]}>
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  filter: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 14,
    letterSpacing: -0.2,
  },
  filterActive: {
    color: "#3A7CFD",
  },
});
