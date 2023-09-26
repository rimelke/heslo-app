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
  userName?: string | null;
  url?: string | null;
}

export default IEntry;
