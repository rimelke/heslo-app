import { ActivityIndicator, View } from "react-native";
import theme from "src/theme";

const Loading = () => (
  <View style={{ flex: 1, justifyContent: "center" }}>
    <ActivityIndicator size="large" color={theme.colors.olive.DEFAULT} />
  </View>
);

export default Loading;
