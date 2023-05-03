import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FoldersStackList } from "@screens/FoldersRouter";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon, PlusIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import Button from "./Button";
import Entry from "./Entry";

interface GroupProps {
  group: IGroup;
  openEntry: (entry: IEntry) => void;
}

const Group = ({ group, openEntry }: GroupProps) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<FoldersStackList, "Folder", "tabs">
    >();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsOpen((oldIsOpen) => !oldIsOpen)}
      style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        borderWidth: 1,
        borderColor: theme.colors.floral.dark,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ChevronRightIcon
          rotation={isOpen ? 90 : 0}
          size={24}
          color={theme.colors.olive.DEFAULT}
        />
        <Text
          style={{
            marginLeft: 16,
            fontSize: 16,
          }}
        >
          {group.title}
        </Text>
      </View>
      <View
        style={{
          marginTop: 16,
          height: isOpen ? "auto" : 0,
          overflow: "hidden",
        }}
      >
        {group.entries.map((entry) => (
          <Entry openEntry={openEntry} entry={entry} key={entry.id} />
        ))}

        <Button
          onPress={() =>
            navigation.getParent("tabs")?.navigate("Add", {
              folderId: group.folderId,
              groupId: group.id,
            })
          }
          colorScheme="floral"
          style={{
            borderColor: theme.colors.floral.dark,
            borderWidth: 1,
            borderStyle: "dashed",
            paddingVertical: 12,
            marginBottom: 16,
          }}
        >
          <PlusIcon size={28} color={theme.colors.olive.dark} />
        </Button>
      </View>
    </TouchableOpacity>
  );
};

export default Group;
