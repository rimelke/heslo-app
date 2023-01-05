import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import IGroup from "src/types/IGroup";
import Entry from "./Entry";

interface GroupProps {
  group: IGroup;
}

const Group = ({ group }: GroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsOpen((oldIsOpen) => !oldIsOpen)}
      style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        borderWidth: 1,
        borderColor: theme.colors.floral.dark,
        borderRadius: 16,
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
          <Entry entry={entry} key={entry.id} />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default Group;
