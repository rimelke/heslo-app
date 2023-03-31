import Button from "@components/Button";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { TabList } from "src/Router";
import IGroup from "src/types/IGroup";
import AddFolder from "./AddFolder";
import AddGroup from "./AddGroup";

interface SecondaryAddProps
  extends BottomTabScreenProps<TabList, "SecondaryAdd"> {
  addGroup: (group: IGroup) => void;
}

const SecondaryAdd = ({ navigation, addGroup, route }: SecondaryAddProps) => {
  const routeType = route.params?.type;
  const [selectedType, setSelectedType] = useState<"group" | "folder">(
    routeType || "group"
  );

  useEffect(() => {
    if (!routeType || routeType === selectedType) return;

    setSelectedType(routeType);
  }, [routeType]);

  return (
    <ScreenContainer withScroll>
      <Title>Add new {selectedType}</Title>
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}
      >
        <Button
          onPress={() => setSelectedType("group")}
          style={{ marginRight: 8, flex: 1 }}
          colorScheme={selectedType === "group" ? "flame" : "floral-dark"}
        >
          Group
        </Button>
        <Button
          onPress={() => setSelectedType("folder")}
          style={{ marginLeft: 8, flex: 1 }}
          colorScheme={selectedType === "folder" ? "flame" : "floral-dark"}
        >
          Folder
        </Button>
      </View>

      {selectedType === "group" ? (
        <AddGroup
          addGroup={addGroup}
          goToFolder={(folderId) =>
            navigation.navigate("FoldersRouter", {
              screen: "Folder",
              params: { folderId },
            })
          }
        />
      ) : (
        <AddFolder
          goToFolders={() =>
            navigation.navigate("FoldersRouter", {
              screen: "Folders",
            })
          }
        />
      )}
    </ScreenContainer>
  );
};

export default SecondaryAdd;
