import { useFolders } from "@contexts/FoldersContext";
import { Text, View } from "react-native";
import Count from "./Count";

const CountsSection = () => {
  const { folders = [] } = useFolders();

  const counts = folders.reduce(
    (acc, folder) => ({
      text: acc.text + (folder.counts.text || 0),
      file: acc.file + (folder.counts.file || 0),
    }),
    { text: 0, file: 0 }
  );

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 18, alignSelf: "center" }}>You have stored</Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          justifyContent: "space-evenly",
        }}
      >
        <Count count={counts.text} label="texts" />
        <Count count={counts.file} label="files" />
      </View>
    </View>
  );
};

export default CountsSection;
