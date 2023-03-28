import Button from "@components/Button";
import Input from "@components/form/Input";
import Select from "@components/form/Select";
import { FileType } from "@components/form/Upload";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import aes256 from "@utils/aes256";
import getFormHandler from "@utils/getFormHandler";
import uploadFile from "@utils/uploadFile";
import { useRef, useState } from "react";
import { Text } from "react-native";
import { PlusIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import { EntryType } from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import { z } from "zod";
import AddGroupEntry from "./AddGroupEntry";

const getRandomId = () => Math.random().toString(36).substring(2);

interface AddGroupData {
  title: string;
  folderId: string;
  entries: {
    title: string;
    type: EntryType;
    content?: string;
    file?: FileType;
  }[];
}

interface AddGroupProps {
  goToFolder: (folderId: string) => void;
  addGroup: (group: IGroup) => void;
}

const AddGroup = ({ goToFolder, addGroup }: AddGroupProps) => {
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest("/groups", "post");
  const { folders = [] } = useFolders();
  const { password = "" } = useAuth();
  const [entriesIds, setEntriesIds] = useState([getRandomId()]);

  const handleSubmit = async (data: AddGroupData) => {
    const result = await sendRequest(data, {
      transformData: async (rawData: AddGroupData) => ({
        ...rawData,
        entries: await Promise.all(
          rawData.entries.map(async ({ file, ...rawEntry }) => {
            const content = rawEntry.content || (await uploadFile(file!));

            return {
              ...rawEntry,
              content: aes256.encrypt(password, content),
            };
          })
        ),
      }),
    });

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
      entries: z
        .array(
          z.object({
            title: z.string({
              required_error: "Title is required",
            }),
            type: z.enum(["text", "file"]),
            content: z.string().optional(),
            file: z.any().optional(),
          })
        )
        .min(1)
        .superRefine((val, ctx) =>
          val.forEach((v, i) => {
            if (v.type === "text" && !v.content) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Content is required",
                path: [i, "content"],
              });

              return;
            }

            if (v.type === "file" && !v.file) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "File is required",
                path: [i, "file"],
              });
            }
          })
        ),
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

      <Text
        style={{
          marginTop: 24,
          fontWeight: "500",
          color: theme.colors.olive.DEFAULT,
          fontSize: 18,
        }}
      >
        Entries
      </Text>

      {entriesIds.map((id, index) => (
        <AddGroupEntry key={id} index={index} />
      ))}

      <Button
        colorScheme="floral"
        onPress={() =>
          setEntriesIds((oldEntriesIds) => [...oldEntriesIds, getRandomId()])
        }
        style={{
          borderColor: theme.colors.floral.dark,
          borderWidth: 1,
          borderStyle: "dashed",
          paddingVertical: 8,
          marginTop: 8,
        }}
      >
        <PlusIcon color={theme.colors.olive.DEFAULT} />
      </Button>

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
