import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IEntry from "src/types/IEntry";
import Entry from "./Entry";
import Folder from "./Folder";
import Folders from "./Folders";

export type FoldersStackList = {
  Folders: undefined;
  Folder: { folderId: string };
  Entry: { entry: IEntry };
};

const Stack = createNativeStackNavigator<FoldersStackList>();

const FoldersRouter = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Folders"
  >
    <Stack.Screen name="Folders" component={Folders} />
    <Stack.Screen name="Folder" component={Folder} />
    <Stack.Screen name="Entry" component={Entry} />
  </Stack.Navigator>
);

export default FoldersRouter;
