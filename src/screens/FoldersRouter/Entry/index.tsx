import BackArrow from "@components/BackArrow";
import Input from "@components/form/Input";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Form } from "@unform/mobile";
import { Text, TouchableOpacity, View } from "react-native";
import { FoldersStackList } from "..";
import aes256 from "@utils/aes256";
import { useAuth } from "@contexts/AuthContext";
import Button from "@components/Button";
import { useRef } from "react";
import { FormHandles } from "@unform/core";
import getFormHandler from "@utils/getFormHandler";
import { z } from "zod";
import useRequest from "@hooks/useRequest";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
import { ClipboardIcon, TrashIcon } from "react-native-heroicons/solid";
import * as Clipboard from "expo-clipboard";

interface EntryData {
  title: string;
  content: string;
}

type Props = NativeStackScreenProps<FoldersStackList, "Entry"> & {
  updateEntry: (id: string, entry: IEntry) => void;
};

const Entry = ({ route, updateEntry, navigation }: Props) => {
  const { entry } = route.params;
  const { password } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest(
    `/entries/${entry.id}`,
    "patch"
  );

  const handleSubmit = async (data: EntryData) => {
    if (!password) return;

    const encryptedContent = aes256.encrypt(password, data.content);

    const result = await sendRequest({
      title: data.title,
      content: encryptedContent,
    });

    if (!result) return;

    updateEntry(entry.id, result);
    navigation.goBack();
  };

  const formHandler = getFormHandler<EntryData>(
    formRef,
    z.object({
      title: z.string({ required_error: "Title is required" }),
      content: z.string({ required_error: "Content is required" }),
    }),
    handleSubmit
  );

  const initialData = {
    ...entry,
    content: aes256.decrypt(password || "", entry.content),
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow />

        <Title>{entry.title}</Title>
      </View>
      <Form
        ref={formRef}
        style={{ marginTop: 24 }}
        initialData={initialData}
        onSubmit={formHandler}
      >
        <Input name="title" label="Title" placeholder="Type the title" />
        {entry.type === "text" ? (
          <TextInput />
        ) : (
          <FileInput url={initialData.content} />
        )}
        {error && (
          <Text style={{ color: theme.colors.red[500], marginTop: 24 }}>
            {error}
          </Text>
        )}
        <View
          style={{ marginTop: 24, flexDirection: "row", alignItems: "center" }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.olive.DEFAULT,
              padding: 9,
              borderRadius: 8,
            }}
          >
            <TrashIcon size={24} color={theme.colors.floral.DEFAULT} />
          </TouchableOpacity>
          <Button
            isLoading={isLoading}
            onPress={() => formRef.current?.submitForm()}
            style={{ flex: 1, marginHorizontal: 12 }}
          >
            Save
          </Button>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(initialData.content)}
            style={{
              backgroundColor: theme.colors.olive.DEFAULT,
              padding: 9,
              borderRadius: 8,
            }}
          >
            <ClipboardIcon size={24} color={theme.colors.floral.DEFAULT} />
          </TouchableOpacity>
        </View>
      </Form>
    </ScreenContainer>
  );
};

export default Entry;
