import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Folder from "./Folder";
import Folders from "./Folders";

export type FoldersStackList = {
  Folders: undefined;
  Folder: { folderId: string };
};

const Stack = createNativeStackNavigator<FoldersStackList>();

const FoldersRouter = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Folders"
  >
    <Stack.Screen name="Folders" component={Folders} />
    <Stack.Screen name="Folder" component={Folder} />
  </Stack.Navigator>
);

export default FoldersRouter;
