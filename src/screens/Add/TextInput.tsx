import Button from "@components/Button";
import Input from "@components/form/Input";
import getStrongPassword from "@utils/getStrongPassword";
import { useRef } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { ArrowPathIcon, ClipboardIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import * as Clipboard from "expo-clipboard";

const TextInput = () => {
  const inputRef = useRef<NativeTextInput>(null);
  const valueRef = useRef<string>("");

  const handleGenerate = () => {
    if (!inputRef.current) return;

    const strongPassword = getStrongPassword();

    inputRef.current.setNativeProps({ text: strongPassword });
    valueRef.current = strongPassword;
  };

  const handleCopy = () => {
    if (!valueRef.current) return;

    Clipboard.setStringAsync(valueRef.current);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Input
        ref={inputRef}
        onChangeText={(value) => (valueRef.current = value)}
        name="content"
        label="Content"
        multiline
        style={{ flex: 1 }}
      />
      <Button
        onPress={handleCopy}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          marginLeft: 8,
          marginTop: 28,
        }}
        colorScheme="olive"
      >
        <ClipboardIcon size={20} color={theme.colors.floral.DEFAULT} />
      </Button>
      <Button
        onPress={handleGenerate}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          marginLeft: 8,
          marginTop: 28,
        }}
        colorScheme="olive"
      >
        <ArrowPathIcon size={20} color={theme.colors.floral.DEFAULT} />
      </Button>
    </View>
  );
};

export default TextInput;
