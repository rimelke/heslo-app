import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from "react";
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

export interface FoldersRouterRef {
  addEntry: (entry: IEntry) => void;
}

const FoldersRouterWithRef: ForwardRefRenderFunction<FoldersRouterRef, {}> = (
  _props,
  ref
) => {
  const folderRef = useRef<FolderRef>(null);

  const addEntry = (entry: IEntry) => {
    folderRef.current?.addEntry(entry);
  };

  useImperativeHandle(
    ref,
    () => ({
      addEntry,
    }),
    []
  );

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
      id="folders"
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

const FoldersRouter = forwardRef(FoldersRouterWithRef);

export default FoldersRouter;
