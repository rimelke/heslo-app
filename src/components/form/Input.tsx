import React, {
  useRef,
  useEffect,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useField } from "@unform/core";
import theme from "../../theme";

interface Props extends TextInputProps {
  name: string;
  label?: string;
}

export interface InputRef {
  setValue: (value: string) => void;
  getValue: () => string | undefined;
}

const InputWithRef: ForwardRefRenderFunction<InputRef, Props> = (
  { name, label, onChangeText = () => {}, style, ...rest },
  passedRef
) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);

  const inputRef = useRef<TextInput>(null);
  const valueRef = useRef(defaultValue || "");

  const setValue = (value: string) => {
    valueRef.current = value;

    if (!inputRef.current) return;

    inputRef.current.setNativeProps({ text: value });
  };

  const getValue = () => valueRef.current || undefined;

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue,
      setValue: (_, newValue: string) => setValue(newValue),
      clearValue: () => {
        valueRef.current = "";

        if (!inputRef.current) return;

        inputRef.current.setNativeProps({ text: "" });
      },
    });
  }, [fieldName, registerField]);

  useImperativeHandle(
    passedRef,
    () => ({
      setValue,
      getValue,
    }),
    []
  );

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
};

const Input = forwardRef(InputWithRef);

export default Input;
