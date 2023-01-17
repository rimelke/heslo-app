import { Text, View } from "react-native";
import theme from "src/theme";

interface CountProps {
  count: number;
  label: string;
}

const Count = ({ count, label }: CountProps) => (
  <View
    style={{
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderWidth: 1,
      borderColor: theme.colors.floral.dark,
      borderRadius: 8,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        fontSize: 28,
        color: theme.colors.flame.DEFAULT,
        fontWeight: "bold",
      }}
    >
      {count}
    </Text>
    <Text
      style={{
        marginTop: 8,
        fontSize: 16,
      }}
    >
      {label}
    </Text>
  </View>
);

export default Count;
