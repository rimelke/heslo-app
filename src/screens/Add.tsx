import Button from "@components/Button";
import Input from "@components/form/Input";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import IEntry, { EntryType } from "src/types/IEntry";
import Upload, { FileType } from "@components/form/Upload";
import api from "@services/api";
import * as FileSystem from "expo-file-system";
import getFormHandler from "@utils/getFormHandler";
import { z } from "zod";
import { useAuth } from "@contexts/AuthContext";
import aes256 from "@utils/aes256";
import useRequest from "@hooks/useRequest";
import Select from "@components/form/Select";
import { useFolders } from "@contexts/FoldersContext";
import theme from "src/theme";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabList } from "src/Router";

const uploadFile = async (rawFile: FileType) => {
  const { data } = await api.post("/upload", {
    fileName: rawFile.name,
  });

  await FileSystem.uploadAsync(data.url, rawFile.uri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      "Content-Type": rawFile.type,
    },
  });

  return encodeURI(`${process.env.FILES_CDN_URL}${data.path}`);
};

interface AddData {
  title: string;
  folderId: string;
  content?: string;
  file?: FileType;
}

interface AddProps extends BottomTabScreenProps<TabList, "Add"> {
  addEntry: (entry: IEntry) => void;
}

const Add = ({ navigation, addEntry }: AddProps) => {
  const formRef = useRef<FormHandles>(null);
  const [selectedType, setSelectedType] = useState<EntryType>("text");
  const { password } = useAuth();
  const { error, isLoading, sendRequest } = useRequest("/entries");
  const { folders, updateFolder } = useFolders();

  const handleSubmit = async (data: AddData) => {
    if (!password || (!data.content && !data.file)) return;

    const result = await sendRequest(
      {
        ...data,
        type: selectedType,
      },
      {
        transformData: async ({ file, ...rawData }: AddData) => {
          const content = rawData.content || (await uploadFile(file!));

          return {
            ...rawData,
            content: aes256.encrypt(password, content),
          };
        },
      }
    );

    if (!result) return;

    updateFolder(result.folderId, (folder) => ({
      counts: {
        ...folder.counts,
        [selectedType]: (folder.counts[selectedType] || 0) + 1,
      },
    }));
    addEntry(result);
    navigation.navigate("FoldersRouter", {
      screen: "Folder",
      params: { folderId: result.folderId },
    });

    formRef.current?.reset();
  };

  const formHandler = getFormHandler<AddData>(
    formRef,
    z.object({
      title: z.string(),
      folderId: z.string(),
      content: z.string().optional(),
      file: z
        .object({
          name: z.string(),
          type: z.string(),
          uri: z.string(),
        })
        .optional(),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer withScroll>
      <Title>Add an entry</Title>
      <View
        style={{
          flexDirection: "row",
          marginTop: 24,
        }}
      >
        <Button
          onPress={() => setSelectedType("text")}
          style={{ marginRight: 8, flex: 1 }}
          colorScheme={selectedType === "text" ? "flame" : "floral-dark"}
        >
          Text
        </Button>
        <Button
          onPress={() => setSelectedType("file")}
          style={{ marginLeft: 8, flex: 1 }}
          colorScheme={selectedType === "file" ? "flame" : "floral-dark"}
        >
          File
        </Button>
      </View>
      <Form ref={formRef} onSubmit={formHandler} style={{ marginTop: 16 }}>
        <Input name="title" label="Title" style={{ marginBottom: 16 }} />
        <Select
          name="folderId"
          label="Folder"
          style={{ marginBottom: 16 }}
          options={
            folders?.map((folder) => ({
              label: folder.title,
              value: folder.id,
            })) || []
          }
        />
        {selectedType === "text" ? (
          <Input name="content" label="Content" multiline />
        ) : (
          <Upload name="file" />
        )}

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

export default Add;
