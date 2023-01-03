import { PropsWithChildren } from "react";
import { Text } from "react-native";
import theme from "../theme";

const Title = ({ children }: PropsWithChildren<{}>) => (
  <Text
    style={{
      fontSize: 24,
      color: theme.colors.olive.dark,
    }}
  >
    {children}
  </Text>
);

export default Title;
