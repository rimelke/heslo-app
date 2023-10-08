import BackArrow from "@components/BackArrow";
import Button from "@components/Button";
import Input from "@components/form/Input";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import getFormHandler from "@utils/getFormHandler";
import { useRef } from "react";
import { Text, View } from "react-native";
import theme from "src/theme";
import { z } from "zod";
import { FoldersStackList } from ".";
import { useAuth } from "@contexts/AuthContext";
import aes256 from "@utils/aes256";

interface EditFolderData {
  title: string;
}

const EditFolder = ({
  route,
  navigation,
}: NativeStackScreenProps<FoldersStackList, "EditFolder">) => {
  const { folderId } = route.params;

  const { folders = [], updateFolder } = useFolders();
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest(
    `/folders/${folderId}`,
    "patch"
  );
  const { password = "" } = useAuth();

  const folder = folders.find((folder) => folder.id === folderId);

  if (!folder) return null;

  const handleSubmit = async (data: EditFolderData) => {
    const result = await sendRequest({
      ...data,
      title: aes256.encrypt(password, data.title),
    });

    if (!result) return;

    updateFolder(result.id, result);
    navigation.navigate("Folders");
    formRef.current?.reset();
  };

  const formHandler = getFormHandler<EditFolderData>(
    formRef,
    z.object({
      title: z.string({
        required_error: "Title is required",
      }),
    }),
    handleSubmit
  );

  const folderTitle = aes256.decrypt(password, folder.title);

  return (
    <ScreenContainer withScroll>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow onPress={() => navigation.replace("Folder", { folderId })} />

        <Title>Edit folder - {folderTitle}</Title>
      </View>

      <Form
        initialData={{
          ...folder,
          title: folderTitle,
        }}
        style={{ marginTop: 24 }}
        ref={formRef}
        onSubmit={formHandler}
      >
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
          Save changes
        </Button>
      </Form>
    </ScreenContainer>
  );
};

export default EditFolder;
