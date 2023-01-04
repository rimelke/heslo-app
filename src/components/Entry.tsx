import { Text, TouchableOpacity } from "react-native";
import { DocumentIcon, LockClosedIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";

interface EntryProps {
  entry: IEntry;
}

const Entry = ({ entry }: EntryProps) => {
  const Icon = entry.type === "text" ? LockClosedIcon : DocumentIcon;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.floral.dark,
        borderRadius: 16,
        marginBottom: 16,
      }}
    >
      <Icon size={24} color={theme.colors.olive.DEFAULT} />
      <Text
        style={{
          marginLeft: 16,
          fontSize: 16,
        }}
      >
        {entry.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Entry;
