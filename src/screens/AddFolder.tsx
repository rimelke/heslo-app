import Button from "@components/Button";
import Input from "@components/form/Input";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import getFormHandler from "@utils/getFormHandler";
import { useRef } from "react";
import { Text } from "react-native";
import { TabList } from "src/Router";
import theme from "src/theme";
import { z } from "zod";

interface AddFolderData {
  title: string;
}

const AddFolder = ({
  navigation,
}: BottomTabScreenProps<TabList, "AddFolder">) => {
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
    navigation.navigate("FoldersRouter", { screen: "Folders" });
    formRef.current?.reset();
  };

  const formHandler = getFormHandler<AddFolderData>(
    formRef,
    z.object({
      title: z.string(),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer>
      <Title>Add a folder</Title>
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
          Add
        </Button>
      </Form>
    </ScreenContainer>
  );
};

export default AddFolder;
