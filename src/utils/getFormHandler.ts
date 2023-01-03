import { FormHandles } from "@unform/core";
import { RefObject } from "react";
import { z } from "zod";

const getPath = (path: (string | number)[]) => {
  let result = "";

  path.forEach((item, index) => {
    result +=
      index === 0 ? item : typeof item === "number" ? `[${item}]` : `.${item}`;
  });

  return result;
};

const getFormHandler = <T = any>(
  formRef: RefObject<FormHandles>,
  schema: z.ZodType<T>,
  callback: (data: T) => void
) => {
  const handler = (data: T) => {
    if (!formRef.current) return;

    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        errors[getPath(issue.path)] = issue.message;
      });

      formRef.current.setErrors(errors);

      return;
    }

    callback(result.data);
  };

  return handler;
};

export default getFormHandler;
