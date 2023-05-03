import Button from "@components/Button";
import Input from "@components/form/Input";
import Select from "@components/form/Select";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import getFormHandler from "@utils/getFormHandler";
import { useRef } from "react";
import { Text } from "react-native";
import theme from "src/theme";
import IGroup from "src/types/IGroup";
import { z } from "zod";

interface AddGroupData {
  title: string;
  folderId: string;
}

interface AddGroupProps {
  goToFolder: (folderId: string) => void;
  addGroup: (group: IGroup) => void;
}

const AddGroup = ({ goToFolder, addGroup }: AddGroupProps) => {
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest("/groups", "post");
  const { folders = [] } = useFolders();

  const handleSubmit = async (data: AddGroupData) => {
    const result = await sendRequest(data);

    if (!result) return;

    formRef.current?.reset();
    addGroup(result);
    goToFolder(result.folderId);
  };

  const formHandler = getFormHandler<AddGroupData>(
    formRef,
    z.object({
      title: z.string({ required_error: "Title is required" }),
      folderId: z.string({ required_error: "Folder is required" }),
    }),
    handleSubmit
  );

  return (
    <Form style={{ marginTop: 24 }} ref={formRef} onSubmit={formHandler}>
      <Select
        name="folderId"
        label="Folder"
        options={folders.map((folder) => ({
          label: folder.title,
          value: folder.id,
        }))}
      />

      <Input name="title" label="Title" style={{ marginTop: 16 }} />

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
        Add group
      </Button>
    </Form>
  );
};

export default AddGroup;
