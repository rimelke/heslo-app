import BackArrow from "@components/BackArrow";
import Button from "@components/Button";
import Entry from "@components/Entry";
import Group from "@components/Group";
import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useFolders } from "@contexts/FoldersContext";
import useGet from "@hooks/useGet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";
import { FlatList, View } from "react-native";
import { PlusIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import { FoldersStackList } from ".";

export interface FolderRef {
  updateEntry: (id: string, entry: IEntry) => void;
  deleteEntry: (id: string) => void;
}

const FolderWithRef: ForwardRefRenderFunction<
  FolderRef,
  NativeStackScreenProps<FoldersStackList, "Folder", "tabs">
> = ({ route, navigation }, ref) => {
  const { folderId } = route.params;

  const { folders } = useFolders();
  const { data, isLoading, setData } = useGet<(IEntry | IGroup)[]>(
    `/folders/${folderId}/entries`
  );

  const folder = folders?.find((folder) => folder.id === route.params.folderId);

  const updateEntry = (id: string, entry: IEntry) => {
    setData((oldData) =>
      oldData?.map((item) => (item.id === id ? entry : item))
    );
  };

  const deleteEntry = (id: string) => {
    setData((oldData) => oldData?.filter((item) => item.id !== id));
  };

  useImperativeHandle(
    ref,
    () => ({
      updateEntry,
      deleteEntry,
    }),
    []
  );

  const openEntry = (entry: IEntry) => {
    navigation.navigate("Entry", { entry });
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow />

        <Title>{folder?.title}</Title>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
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
              onPress={() => navigation.getParent("tabs")?.navigate("Add")}
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
      )}
    </ScreenContainer>
  );
};

const Folder = forwardRef(FolderWithRef);

export default Folder;
