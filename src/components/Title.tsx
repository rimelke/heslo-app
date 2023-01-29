import { PropsWithChildren } from "react";
import { Text, Dimensions } from "react-native";
import theme from "../theme";

const { width } = Dimensions.get("window");

const Title = ({ children }: PropsWithChildren<{}>) => (
  <Text
    style={{
      fontSize: width < 400 ? 20 : 24,
      color: theme.colors.olive.dark,
    }}
  >
    {children}
  </Text>
);

export default Title;
