import Button from "@components/Button";
import Input, { InputRef } from "@components/form/Input";
import getStrongPassword from "@utils/getStrongPassword";
import { useRef } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { ArrowPathIcon, ClipboardIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import * as Clipboard from "expo-clipboard";

const TextInput = () => {
  const inputRef = useRef<InputRef>(null);

  const handleGenerate = () => {
    if (!inputRef.current) return;

    const strongPassword = getStrongPassword();

    inputRef.current.setValue(strongPassword);
  };

  const handleCopy = () => {
    if (!inputRef.current) return;

    const value = inputRef.current.getValue();

    if (!value) return;

    Clipboard.setStringAsync(value);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Input
        ref={inputRef}
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
