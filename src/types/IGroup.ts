import IEntry from "./IEntry";

interface IGroup {
  id: string;
  userId: string;
  folderId: string;
  title: string;
  entries: IEntry[];
  createdAt: string;
  updatedAt: string;
}

export default IGroup;
