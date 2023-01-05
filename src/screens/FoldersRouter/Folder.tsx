import BackArrow from "@components/BackArrow";
import Entry from "@components/Entry";
import Group from "@components/Group";
import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useFolders } from "@contexts/FoldersContext";
import useGet from "@hooks/useGet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";
import IEntry from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import { FoldersStackList } from ".";

const Folder = ({
  route,
  navigation,
}: NativeStackScreenProps<FoldersStackList, "Folder">) => {
  const { folderId } = route.params;

  const { folders } = useFolders();
  const { data, isLoading } = useGet<(IEntry | IGroup)[]>(
    `/folders/${folderId}/entries`
  );

  const folder = folders?.find((folder) => folder.id === route.params.folderId);

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
        />
      )}
    </ScreenContainer>
  );
};

export default Folder;
