import { Picker } from "@react-native-picker/picker";
import { useField } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { Text, View, ViewProps } from "react-native";
import theme from "src/theme";

interface SelectProps extends ViewProps {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

const Select = ({
  options,
  style,
  label,
  name,
  onValueChange,
  placeholder,
}: SelectProps) => {
  const { clearError, error, fieldName, registerField, defaultValue } =
    useField(name);

  const [value, setValue] = useState(
    defaultValue || (placeholder ? undefined : options[0]?.value)
  );
  const valueRef = useRef(value);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => valueRef.current,
      setValue: (_, newValue) => {
        setValue(newValue);
        valueRef.current = newValue;
      },
      clearValue: () => {
        setValue(options[0].value);
        valueRef.current = options[0].value;
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

      <View
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.red[500] : theme.colors.floral.dark,
          borderRadius: 8,
        }}
      >
        <Picker
          onFocus={clearError}
          selectedValue={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            valueRef.current = newValue;
            onValueChange?.(newValue);
          }}
          style={{
            color: theme.colors.olive.DEFAULT,
            height: 46,
          }}
        >
          {placeholder && (
            <Picker.Item
              style={{
                fontSize: 14,
              }}
              label={placeholder}
            />
          )}

          {options.map((option) => (
            <Picker.Item
              style={{
                fontSize: 14,
              }}
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      {error && (
        <Text style={{ marginTop: 8, color: theme.colors.red[500] }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Select;
