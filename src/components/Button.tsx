import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import theme from "../theme";

interface Props extends TouchableOpacityProps {
  children: string;
  isLoading?: boolean;
}

const Button = ({ children, style, isLoading, disabled, ...props }: Props) => (
  <TouchableOpacity
    disabled={isLoading || disabled}
    style={[
      {
        backgroundColor: isLoading
          ? theme.colors.flame.disabled
          : theme.colors.flame.DEFAULT,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
      },
      style,
    ]}
    {...props}
  >
    {isLoading && (
      <ActivityIndicator
        style={{ marginRight: 16 }}
        color={theme.colors.floral.DEFAULT}
      />
    )}

    <Text
      style={{
        color: theme.colors.floral.DEFAULT,
      }}
    >
      {children}
    </Text>
  </TouchableOpacity>
);

export default Button;
