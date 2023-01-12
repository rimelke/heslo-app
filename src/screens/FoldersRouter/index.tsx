import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRef } from "react";
import IEntry from "src/types/IEntry";
import Entry from "./Entry";
import Folder, { FolderRef } from "./Folder";
import Folders from "./Folders";

export type FoldersStackList = {
  Folders: undefined;
  Folder: { folderId: string };
  Entry: { entry: IEntry };
};

const Stack = createNativeStackNavigator<FoldersStackList>();

const FoldersRouter = () => {
  const folderRef = useRef<FolderRef>(null);

  const updateEntry = (id: string, entry: IEntry) => {
    folderRef.current?.updateEntry(id, entry);
  };

  const deleteEntry = (id: string) => {
    folderRef.current?.deleteEntry(id);
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Folders"
    >
      <Stack.Screen name="Folders" component={Folders} />
      <Stack.Screen name="Folder">
        {(props) => <Folder {...props} ref={folderRef} />}
      </Stack.Screen>
      <Stack.Screen name="Entry">
        {(props) => (
          <Entry
            {...props}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default FoldersRouter;
