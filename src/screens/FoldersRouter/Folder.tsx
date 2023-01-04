import Entry from "@components/Entry";
import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useFolders } from "@contexts/FoldersContext";
import useGet from "@hooks/useGet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, TouchableOpacity, View } from "react-native";
import { ArrowSmallLeftIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import { FoldersStackList } from ".";

const Folder = ({
  route,
  navigation,
}: NativeStackScreenProps<FoldersStackList, "Folder">) => {
  const { folderId } = route.params;

  const { folders } = useFolders();
  const { data, isLoading } = useGet<IEntry[]>(`/folders/${folderId}/entries`);

  const folder = folders?.find((folder) => folder.id === route.params.folderId);

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.goBack()}
        >
          <ArrowSmallLeftIcon size={24} color={theme.colors.olive.DEFAULT} />
        </TouchableOpacity>

        <Title>{folder?.title}</Title>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          style={{ marginTop: 16 }}
          renderItem={({ item }) => <Entry entry={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </ScreenContainer>
  );
};

export default Folder;
