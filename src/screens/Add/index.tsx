import Button from "@components/Button";
import Loading from "@components/Loading";
import PremiumPlaceholder from "@components/PremiumPlaceholder";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import Input from "@components/form/Input";
import Select from "@components/form/Select";
import Upload, { FileType } from "@components/form/Upload";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import useGet from "@hooks/useGet";
import useRequest from "@hooks/useRequest";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import aes256 from "@utils/aes256";
import getFormHandler from "@utils/getFormHandler";
import uploadFile from "@utils/uploadFile";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { TabList } from "src/Router";
import theme from "src/theme";
import IEntry, { EntryType } from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import { z } from "zod";
import TextInput from "./TextInput";

interface AddData {
  title: string;
  folderId: string;
  content?: string;
  file?: FileType;
}

interface AddProps extends BottomTabScreenProps<TabList, "Add"> {
  addEntry: (entry: IEntry) => void;
}

const Add = ({
  navigation,
  addEntry,
  route: { params: { folderId, groupId } = {} },
}: AddProps) => {
  const formRef = useRef<FormHandles>(null);
  const [selectedType, setSelectedType] = useState<EntryType>("text");
  const { folders = [], updateFolder, totalEntries } = useFolders();

  const [selectedFolderId, setSelectedFolderId] = useState(
    folderId || folders[0]?.id
  );
  const { data: entries } = useGet<(IEntry | IGroup)[]>(
    `/folders/${selectedFolderId}/entries`,
    [selectedFolderId]
  );

  const { password = "", user } = useAuth();
  const { error, isLoading, sendRequest } = useRequest("/entries");

  useEffect(() => {
    const newFolderId = folderId || folders[0]?.id;

    setSelectedFolderId(newFolderId);

    if (!formRef.current) return;

    formRef.current.setFieldValue("folderId", newFolderId);
    formRef.current.setFieldValue("groupId", groupId);
  }, [folderId, groupId]);

  const groups = entries?.filter((entry) => "entries" in entry) as
    | IGroup[]
    | undefined;

  const handleSubmit = async (data: AddData) => {
    if (!password || (!data.content && !data.file)) return;

    const result = await sendRequest(
      {
        ...data,
        shouldAutoload: false,
        type: selectedType,
      },
      {
        transformData: async ({ file, ...rawData }: AddData) => {
          const content = rawData.content || (await uploadFile(file!));

          return {
            ...rawData,
            title: aes256.encrypt(password, rawData.title),
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
      title: z.string({
        required_error: "Title is required",
      }),
      content: z
        .string({
          required_error: "Content is required",
        })
        .optional()
        .refine((value) => (selectedType === "text" ? !!value : true), {
          message: "Content is required",
        }),
      groupId: z.string().optional(),
      file: z
        .object({
          name: z.string(),
          type: z.string(),
          uri: z.string(),
        })
        .optional()
        .refine((value) => (selectedType === "file" ? !!value : true), {
          message: "File is required",
        }),

      folderId: z.string({
        required_error: "Folder is required",
      }),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer withScroll>
      <Title>Add an entry</Title>
      <PremiumPlaceholder
        message="You can only add 20 entries in the free plan."
        customCheck={totalEntries >= 20 && (!user || user.plan === "free")}
      >
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
        <PremiumPlaceholder
          customCheck={
            selectedType === "file" && (!user || user.plan === "free")
          }
        >
          <Form
            ref={formRef}
            onSubmit={formHandler}
            style={{ marginTop: 16 }}
            initialData={{
              folderId: selectedFolderId,
              groupId,
            }}
          >
            <Input name="title" label="Title" style={{ marginBottom: 16 }} />
            <Select
              name="folderId"
              label="Folder"
              style={{ marginBottom: 16 }}
              onValueChange={(value) => setSelectedFolderId(value)}
              options={folders.map((folder) => ({
                label: aes256.decrypt(password, folder.title),
                value: folder.id,
              }))}
            />

            {groups ? (
              groups.length > 0 && (
                <Select
                  name="groupId"
                  label="Group"
                  placeholder="Select a group"
                  style={{ marginBottom: 16 }}
                  options={groups.map((group) => ({
                    label: aes256.decrypt(password, group.title),
                    value: group.id,
                  }))}
                />
              )
            ) : (
              <Loading />
            )}

            {selectedType === "text" ? <TextInput /> : <Upload name="file" />}

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
        </PremiumPlaceholder>
      </PremiumPlaceholder>
    </ScreenContainer>
  );
};

export default Add;
