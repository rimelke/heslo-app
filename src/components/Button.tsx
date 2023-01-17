import { PropsWithChildren } from "react";
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
  colorScheme?: "flame" | "olive" | "floral-dark" | "floral";
}

const Button = ({
  children,
  style,
  isLoading,
  disabled,
  colorScheme = "flame",
  ...props
}: Props) => (
  <TouchableOpacity
    disabled={isLoading || disabled}
    style={[
      {
        backgroundColor:
          isLoading || disabled
            ? theme.colors[colorScheme].disabled
            : theme.colors[colorScheme].DEFAULT,
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
        color:
          colorScheme === "floral"
            ? theme.colors.flame.DEFAULT
            : theme.colors.floral.DEFAULT,
      }}
    >
      {children}
    </Text>
  </TouchableOpacity>
);

export default Button;
