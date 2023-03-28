import { useField } from "@unform/core";
import { useEffect, useRef } from "react";

interface HiddenInputProps {
  name: string;
  value: any;
}

const HiddenInput = ({ name, value }: HiddenInputProps) => {
  const valueRef = useRef(value);
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => valueRef.current,
    });
  }, [fieldName, registerField]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return null;
};

export default HiddenInput;
