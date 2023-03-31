import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from "react";
import IEntry from "src/types/IEntry";
import IGroup from "src/types/IGroup";
import EditFolder from "./EditFolder";
import Entry from "./Entry";
import Folder, { FolderRef } from "./Folder";
import Folders from "./Folders";

export type FoldersStackList = {
  Folders: undefined;
  Folder: { folderId: string };
  Entry: { entry: IEntry; group?: IGroup };
  EditFolder: { folderId: string };
};

const Stack = createNativeStackNavigator<FoldersStackList>();

export interface FoldersRouterRef {
  addItem: (item: IEntry | IGroup) => void;
  updateEntriesPassword: (oldPassword: string, newPassword: string) => void;
}

const FoldersRouterWithRef: ForwardRefRenderFunction<FoldersRouterRef, {}> = (
  _props,
  ref
) => {
  const folderRef = useRef<FolderRef>(null);

  const addItem = (item: IEntry | IGroup) => {
    folderRef.current?.addItem(item);
  };

  const updateEntriesPassword = (oldPassword: string, newPassword: string) => {
    folderRef.current?.updateEntriesPassword(oldPassword, newPassword);
  };

  useImperativeHandle(
    ref,
    () => ({
      addItem,
      updateEntriesPassword,
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
      <Stack.Screen name="EditFolder" component={EditFolder} />
    </Stack.Navigator>
  );
};

const FoldersRouter = forwardRef(FoldersRouterWithRef);

export default FoldersRouter;
