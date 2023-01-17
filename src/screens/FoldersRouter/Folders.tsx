import Button from "@components/Button";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { useFolders, IFolder } from "@contexts/FoldersContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { DocumentIcon, LockClosedIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import { FoldersStackList } from ".";

const colors = [
  "#ef4444",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

interface FolderItemProps {
  folder: IFolder;
  index: number;
  goToFolder: (folderId: string) => void;
}

const FolderItem = ({ folder, index, goToFolder }: FolderItemProps) => (
  <TouchableOpacity
    onPress={() => goToFolder(folder.id)}
    style={{
      padding: 16,
      borderColor: theme.colors.floral.dark,
      borderWidth: 1,
      borderRadius: 16,
      marginBottom: 16,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 9999,
          backgroundColor: colors[index % colors.length],
          marginRight: 12,
        }}
      />
      <Text
        style={{
          fontWeight: "bold",
          color: theme.colors.olive.DEFAULT,
          fontSize: 16,
        }}
      >
        {folder.title}
      </Text>
    </View>
    {Boolean(folder.counts.file || folder.counts.text) && (
      <View style={{ marginTop: 12 }}>
        {folder.counts.text && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <LockClosedIcon size={16} color={theme.colors.olive.DEFAULT} />
              <Text
                style={{ color: theme.colors.olive.DEFAULT, marginLeft: 8 }}
              >
                Passwords
              </Text>
            </View>
            <Text style={{ color: theme.colors.olive.DEFAULT }}>
              {folder.counts.text}
            </Text>
          </View>
        )}
        {folder.counts.file && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DocumentIcon size={16} color={theme.colors.olive.DEFAULT} />
              <Text
                style={{ color: theme.colors.olive.DEFAULT, marginLeft: 8 }}
              >
                Files
              </Text>
            </View>
            <Text style={{ color: theme.colors.olive.DEFAULT }}>
              {folder.counts.file}
            </Text>
          </View>
        )}
      </View>
    )}
  </TouchableOpacity>
);

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
                navigation.getParent("tabs")?.navigate("AddFolder")
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
