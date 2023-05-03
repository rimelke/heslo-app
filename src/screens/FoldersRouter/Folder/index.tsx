import BackArrow from "@components/BackArrow";
import Button from "@components/Button";
import Entry from "@components/Entry";
import Group from "@components/Group";
import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import useGet from "@hooks/useGet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import aes256 from "@utils/aes256";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";
import { FlatList, Text, View } from "react-native";
import {
  ArchiveBoxIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import { FoldersStackList } from "..";
import DeleteFolder from "./DeleteFolder";

export interface FolderRef {
  addItem: (item: IEntry | IGroup) => void;
  updateEntry: (id: string, entry: IEntry) => void;
  deleteEntry: (id: string) => void;
  updateEntriesPassword: (oldPassword: string, newPassword: string) => void;
}

const FolderWithRef: ForwardRefRenderFunction<
  FolderRef,
  NativeStackScreenProps<FoldersStackList, "Folder", "tabs">
> = ({ route, navigation }, ref) => {
  const { folderId } = route.params;

  const { user } = useAuth();
  const { folders } = useFolders();
  const {
    data = [],
    isLoading,
    setData,
  } = useGet<(IEntry | IGroup)[]>(`/folders/${folderId}/entries`);

  const folder = folders?.find((folder) => folder.id === route.params.folderId);

  const addItem = (item: IEntry | IGroup) => {
    if (item.folderId !== folderId) return;

    setData((oldData) => oldData && [...oldData, item]);
  };

  const updateEntry = (id: string, entry: IEntry) => {
    setData((oldData) =>
      oldData?.map((item) =>
        item.id === id
          ? entry
          : "entries" in item
          ? {
              ...item,
              entries: item.entries.map((entry) =>
                entry.id === id ? entry : entry
              ),
            }
          : item
      )
    );
  };

  const deleteEntry = (id: string) => {
    setData((oldData) =>
      oldData
        ?.filter((item) => item.id !== id)
        .map((item) =>
          "entries" in item
            ? {
                ...item,
                entries: item.entries.filter((entry) => entry.id !== id),
              }
            : item
        )
    );
  };

  const updateEntriesPassword = (oldPassword: string, newPassword: string) => {
    const getUpdatedEntry = (entry: IEntry): IEntry => ({
      ...entry,
      content: aes256.encrypt(
        newPassword,
        aes256.decrypt(oldPassword, entry.content)
      ),
    });

    setData((oldData) =>
      oldData?.map((item) =>
        "entries" in item
          ? {
              ...item,
              entries: item.entries.map(getUpdatedEntry),
            }
          : getUpdatedEntry(item)
      )
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      addItem,
      updateEntry,
      deleteEntry,
      updateEntriesPassword,
    }),
    []
  );

  const openEntry = (entry: IEntry) => {
    const group = entry.groupId
      ? (data?.find((item) => item.id === entry.groupId) as IGroup)
      : undefined;

    navigation.navigate("Entry", {
      entry,
      group,
    });
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow onPress={() => navigation.replace("Folders")} />

        <Title>{folder?.title}</Title>

        {user?.plan === "premium" && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onPress={() => navigation.navigate("EditFolder", { folderId })}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}
              colorScheme="olive"
            >
              <PencilIcon size={16} color={theme.colors.floral.DEFAULT} />
            </Button>
            <DeleteFolder
              folderId={folderId}
              goToFolders={() => navigation.replace("Folders")}
            />
          </View>
        )}
      </View>

      {isLoading ? (
        <Loading />
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          style={{ marginTop: 16 }}
          renderItem={({ item }) =>
            "entries" in item ? (
              <Group openEntry={openEntry} group={item} />
            ) : (
              <Entry openEntry={openEntry} entry={item} />
            )
          }
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <Button
              onPress={() =>
                navigation.getParent("tabs")?.navigate("Add", { folderId })
              }
              colorScheme="floral"
              style={{
                borderColor: theme.colors.floral.dark,
                borderWidth: 1,
                borderStyle: "dashed",
                paddingVertical: 16,
              }}
            >
              <PlusIcon size={28} color={theme.colors.olive.dark} />
            </Button>
          }
        />
      ) : (
        <View
          style={{
            marginTop: 48,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ArchiveBoxIcon size={56} color={theme.colors.olive.DEFAULT} />
          <Text
            style={{
              color: theme.colors.olive.DEFAULT,
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 12,
            }}
          >
            No entries found
          </Text>
          <Button
            onPress={() =>
              navigation.getParent("tabs")?.navigate("Add", { folderId })
            }
            colorScheme="olive"
            style={{ marginTop: 28, paddingHorizontal: 32 }}
          >
            + New Entry
          </Button>
        </View>
      )}
    </ScreenContainer>
  );
};

const Folder = forwardRef(FolderWithRef);

export default Folder;
