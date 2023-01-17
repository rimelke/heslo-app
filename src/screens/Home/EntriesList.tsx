import Entry from "@components/Entry";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { TabList } from "src/Router";
import theme from "src/theme";
import IEntry from "src/types/IEntry";

interface EntriesListProps {
  entries: IEntry[];
  title: string;
}

const EntriesList = ({ entries, title }: EntriesListProps) => {
  const navigation = useNavigation<BottomTabNavigationProp<TabList, "Home">>();

  return (
    <View>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>{title}</Text>
      {entries.length > 0 ? (
        <View>
          {entries.map((entry) => (
            <Entry
              openEntry={() =>
                navigation.navigate("FoldersRouter", {
                  screen: "Entry",
                  initial: false,
                  params: {
                    entry,
                  },
                })
              }
              key={entry.id}
              entry={entry}
            />
          ))}
        </View>
      ) : (
        <Text
          style={{
            color: theme.colors.floral.dark,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          No entries yet
        </Text>
      )}
    </View>
  );
};

export default EntriesList;
