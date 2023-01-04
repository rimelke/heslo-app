interface IEntry {
  id: string;
  userId: string;
  folderId: string;
  title: string;
  type: "text" | "file";
  groupId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default IEntry;
