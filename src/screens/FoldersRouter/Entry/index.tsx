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
import { useRef, useState } from "react";
import { FormHandles } from "@unform/core";
import getFormHandler from "@utils/getFormHandler";
import { z } from "zod";
import useRequest from "@hooks/useRequest";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
import {
  ChevronRightIcon,
  ClipboardIcon,
  DocumentIcon,
  FolderIcon,
  LockClosedIcon,
  RectangleGroupIcon,
} from "react-native-heroicons/solid";
import * as Clipboard from "expo-clipboard";
import DeleteEntry from "./DeleteEntry";
import { useFolders } from "@contexts/FoldersContext";

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
  const { password } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest(
    `/entries/${entry.id}`,
    "patch"
  );
  const { folders = [] } = useFolders();

  const folder = folders.find((folder) => folder.id === entry.folderId);

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
        <BackArrow onPress={navigation.goBack} />

        <Title>{entry.title}</Title>
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
            {folder?.title}
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
                {group.title}
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
            {entry.title}
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
