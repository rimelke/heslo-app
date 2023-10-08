import BackArrow from "@components/BackArrow";
import Button from "@components/Button";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import Input from "@components/form/Input";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import aes256 from "@utils/aes256";
import getFormHandler from "@utils/getFormHandler";
import * as Clipboard from "expo-clipboard";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  ChevronRightIcon,
  ClipboardIcon,
  DocumentIcon,
  FolderIcon,
  LockClosedIcon,
  RectangleGroupIcon,
} from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import { z } from "zod";
import { FoldersStackList } from "..";
import DeleteEntry from "./DeleteEntry";
import FileInput from "./FileInput";
import TextInput from "./TextInput";

interface EntryData {
  title: string;
  content: string;
}

type Props = NativeStackScreenProps<FoldersStackList, "Entry"> & {
  updateEntry: (id: string, entry: IEntry) => void;
  deleteEntry: (id: string) => void;
};

const Entry = ({ route, updateEntry, deleteEntry, navigation }: Props) => {
  const { entry, group } = route.params;
  const { password = "" } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest(
    `/entries/${entry.id}`,
    "patch"
  );
  const { folders = [] } = useFolders();

  const folder = folders.find((folder) => folder.id === entry.folderId);

  const handleSubmit = async (data: EntryData) => {
    if (!password) return;

    const result = await sendRequest({
      userName: entry.userName,
      url: entry.url,
      title: aes256.encrypt(password, data.title),
      content: aes256.encrypt(password, data.content),
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
    title: aes256.decrypt(password || "", entry.title),
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow onPress={navigation.goBack} />

        <Title>{aes256.decrypt(password, entry.title)}</Title>
      </View>
      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
          opacity: 0.7,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FolderIcon size={20} color={theme.colors.olive.DEFAULT} />
          <Text
            style={{
              color: theme.colors.olive.DEFAULT,
              marginLeft: 4,
              fontWeight: "bold",
            }}
          >
            {folder && aes256.decrypt(password, folder.title)}
          </Text>
        </View>
        <ChevronRightIcon
          style={{ marginHorizontal: 8 }}
          size={16}
          color={theme.colors.olive.DEFAULT}
        />

        {group && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RectangleGroupIcon
                size={20}
                color={theme.colors.olive.DEFAULT}
              />
              <Text
                style={{
                  color: theme.colors.olive.DEFAULT,
                  marginLeft: 4,
                  fontWeight: "bold",
                }}
              >
                {aes256.decrypt(password, group.title)}
              </Text>
            </View>
            <ChevronRightIcon
              style={{ marginHorizontal: 8 }}
              size={16}
              color={theme.colors.olive.DEFAULT}
            />
          </>
        )}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {entry.type === "text" ? (
            <LockClosedIcon size={20} color={theme.colors.olive.DEFAULT} />
          ) : (
            <DocumentIcon size={20} color={theme.colors.olive.DEFAULT} />
          )}
          <Text
            style={{
              color: theme.colors.olive.DEFAULT,
              marginLeft: 4,
              fontWeight: "bold",
            }}
          >
            {initialData.title}
          </Text>
        </View>
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
          <DeleteEntry
            goToEntries={() => navigation.goBack()}
            entry={entry}
            deleteEntry={deleteEntry}
          />
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
