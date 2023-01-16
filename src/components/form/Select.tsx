import { Picker } from "@react-native-picker/picker";
import { useField } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { Text, View, ViewProps } from "react-native";
import theme from "src/theme";

interface SelectProps extends ViewProps {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
}

const Select = ({ options, style, label, name }: SelectProps) => {
  const [value, setValue] = useState(options[0].value);
  const valueRef = useRef(options[0].value);
  const { clearError, error, fieldName, registerField } = useField(name);

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
          borderColor: theme.colors.floral.dark,
          borderRadius: 8,
        }}
      >
        <Picker
          onFocus={clearError}
          selectedValue={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            valueRef.current = newValue;
          }}
          style={{
            color: theme.colors.olive.DEFAULT,
            height: 46,
          }}
        >
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
