export type EntryType = "text" | "file";

interface IEntry {
  id: string;
  userId: string;
  folderId: string;
  title: string;
  type: EntryType;
  groupId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default IEntry;
