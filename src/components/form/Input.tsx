import React, { useRef, useEffect } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useField } from "@unform/core";
import theme from "../../theme";

interface Props extends TextInputProps {
  name: string;
  label?: string;
}

function Input({
  name,
  label,
  onChangeText = () => {},
  style,
  ...rest
}: Props) {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);

  const inputRef = useRef<TextInput>(null);
  const valueRef = useRef(defaultValue || "");

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => valueRef.current || undefined,
      setValue: (_, newValue) => {
        valueRef.current = newValue;

        if (!inputRef.current) return;

        inputRef.current.setNativeProps({ text: newValue });
      },
      clearValue: () => {
        valueRef.current = "";

        if (!inputRef.current) return;

        inputRef.current.setNativeProps({ text: "" });
      },
    });
  }, [fieldName, registerField]);

  return (
    <View style={style}>
      {label && (
        <Text style={{ marginBottom: 8, color: theme.colors.olive.DEFAULT }}>
          {label}
        </Text>
      )}

      <TextInput
        {...rest}
        ref={inputRef}
        onFocus={clearError}
        onChangeText={(text) => {
          valueRef.current = text;

          onChangeText(text);
        }}
        defaultValue={defaultValue}
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.red[500] : theme.colors.floral.dark,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          color: theme.colors.olive.DEFAULT,
        }}
      />

      {error && (
        <Text style={{ marginTop: 8, color: theme.colors.red[500] }}>
          {error}
        </Text>
      )}
    </View>
  );
}

export default Input;
