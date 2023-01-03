import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import theme from "../theme";

interface Props extends TouchableOpacityProps {
  children: string;
}

const Button = ({ children, style, ...props }: Props) => (
  <TouchableOpacity
    style={[
      {
        backgroundColor: theme.colors.flame.DEFAULT,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
      },
      style,
    ]}
    {...props}
  >
    <Text
      style={{
        color: theme.colors.floral.DEFAULT,
        textAlign: "center",
      }}
    >
      {children}
    </Text>
  </TouchableOpacity>
);

export default Button;
