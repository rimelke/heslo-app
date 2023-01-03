import { TextInput, StyleSheet, TextInputProps } from "react-native";
import theme from "../../theme";

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.floral.dark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    color: theme.colors.olive.DEFAULT,
  },
});

const Input = ({ style, ...props }: TextInputProps) => (
  <TextInput {...props} style={[styles.input, style]} />
);

export default Input;
