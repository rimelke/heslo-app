import Button from "@components/Button";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { FoldersStackList } from "..";
import FolderItem from "./FolderItem";

const Folders = ({
  navigation,
}: NativeStackScreenProps<FoldersStackList, "Folders", "tabs">) => {
  const { folders } = useFolders();
  const { user } = useAuth();

  return (
    <ScreenContainer>
      <Title>Your folders</Title>
      <FlatList
        style={{ marginTop: 16 }}
        data={folders}
        ListFooterComponent={
          user?.plan === "premium" ? (
            <Button
              colorScheme="olive"
              onPress={() =>
                navigation.getParent("tabs")?.navigate("SecondaryAdd", {
                  type: "folder",
                })
              }
            >
              New folder
            </Button>
          ) : undefined
        }
        renderItem={({ item, index }) => (
          <FolderItem
            goToFolder={(folderId) =>
              navigation.navigate("Folder", { folderId })
            }
            folder={item}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ScreenContainer>
  );
};

export default Folders;
