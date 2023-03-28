import Button from "@components/Button";
import Input from "@components/form/Input";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import getFormHandler from "@utils/getFormHandler";
import { useRef } from "react";
import { Text } from "react-native";
import theme from "src/theme";
import { z } from "zod";

interface AddFolderData {
  title: string;
}

interface AddFolderProps {
  goToFolders: () => void;
}

const AddFolder = ({ goToFolders }: AddFolderProps) => {
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest("/folders");
  const { addFolder } = useFolders();

  const handleSubmit = async (data: AddFolderData) => {
    const result = await sendRequest(data);

    if (!result) return;

    addFolder({
      ...result,
      counts: {},
    });
    goToFolders();
    formRef.current?.reset();
  };

  const formHandler = getFormHandler<AddFolderData>(
    formRef,
    z.object({
      title: z.string({
        required_error: "Title is required",
      }),
    }),
    handleSubmit
  );

  return (
    <Form style={{ marginTop: 24 }} ref={formRef} onSubmit={formHandler}>
      <Input name="title" label="Title" />

      {error && (
        <Text style={{ color: theme.colors.red[500], marginTop: 24 }}>
          {error}
        </Text>
      )}

      <Button
        isLoading={isLoading}
        onPress={() => formRef.current?.submitForm()}
        style={{ marginTop: 24 }}
      >
        Add folder
      </Button>
    </Form>
  );
};

export default AddFolder;
