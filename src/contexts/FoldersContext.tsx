import useGet from "@hooks/useGet";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from "react";

export interface IFolder {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  counts: Partial<Record<"text" | "file", number>>;
}

interface IFoldersContextData {
  folders?: IFolder[];
  isFoldersLoading: boolean;
  totalEntries: number;
  addFolder: (newFolder: IFolder) => void;
  updateFolder: (
    folderId: string,
    data: Partial<IFolder> | ((folder: IFolder) => Partial<IFolder>)
  ) => void;
  removeFolder: (folderId: string) => void;
  setFolders: Dispatch<SetStateAction<IFolder[] | undefined>>;
}

export const FoldersContext = createContext({} as IFoldersContextData);

export const FoldersProvider = ({ children }: PropsWithChildren<{}>) => {
  const {
    data: folders,
    isLoading: isFoldersLoading,
    setData: setFolders,
  } = useGet<IFolder[]>("/folders");

  const addFolder = (newFolder: IFolder) => {
    setFolders((oldFolders) => oldFolders && [...oldFolders, newFolder]);
  };

  const updateFolder = (
    folderId: string,
    data: Partial<IFolder> | ((folder: IFolder) => Partial<IFolder>)
  ) => {
    setFolders((oldFolders) =>
      oldFolders?.map((folder) =>
        folder.id === folderId
          ? { ...folder, ...(typeof data === "function" ? data(folder) : data) }
          : folder
      )
    );
  };

  const removeFolder = (folderId: string) => {
    setFolders((oldFolders) =>
      oldFolders?.filter((folder) => folder.id !== folderId)
    );
  };

  const totalEntries =
    folders?.reduce(
      (acc, folder) =>
        acc + (folder.counts.file || 0) + (folder.counts.text || 0),
      0
    ) || 0;

  return (
    <FoldersContext.Provider
      value={{
        folders,
        isFoldersLoading,
        addFolder,
        updateFolder,
        removeFolder,
        totalEntries,
        setFolders,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
};

export const useFolders = () => useContext(FoldersContext);
