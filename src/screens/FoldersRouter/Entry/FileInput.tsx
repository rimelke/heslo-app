import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import { View, Text, TouchableOpacity } from "react-native";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
} from "react-native-heroicons/solid";
import theme from "src/theme";

interface FileInputProps {
  url: string;
}

const FileInput = ({ url }: FileInputProps) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);

  console.log(FileSystem.documentDirectory);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        marginTop: 24,
      }}
    >
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text
          style={{
            color: theme.colors.olive.DEFAULT,
            fontSize: 18,
            fontWeight: "bold",
            textDecorationStyle: "solid",
            textDecorationColor: theme.colors.olive.DEFAULT,
            textDecorationLine: "underline",
          }}
        >
          {fileName}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginLeft: 32 }}
        onPress={() => Linking.openURL(url)}
      >
        <ArrowTopRightOnSquareIcon
          size={24}
          color={theme.colors.olive.DEFAULT}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginLeft: 16 }}
        onPress={() =>
          FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName)
        }
      >
        <ArrowDownTrayIcon size={24} color={theme.colors.olive.DEFAULT} />
      </TouchableOpacity>
    </View>
  );
};

export default FileInput;
