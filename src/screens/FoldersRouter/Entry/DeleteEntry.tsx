import Button from "@components/Button";
import Modal from "@components/Modal";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import deleteFile from "@utils/deleteFile";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import IEntry from "src/types/IEntry";

interface DeleteEntryProps {
  entry: IEntry;
  goToEntries: () => void;
  deleteEntry: (id: string) => void;
}

const DeleteEntry = ({ entry, goToEntries, deleteEntry }: DeleteEntryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { error, isLoading, sendRequest } = useRequest(
    `/entries/${entry.id}`,
    "delete"
  );
  const { updateFolder } = useFolders();
  const { password = "" } = useAuth();

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    const { type, content } = entry;

    const wasSuccessful = await sendRequest();

    if (!wasSuccessful) return;

    deleteEntry(entry.id);
    updateFolder(entry.folderId, (folder) => ({
      counts: { [entry.type]: (folder.counts[entry.type] || 1) - 1 },
    }));
    handleClose();
    goToEntries();

    if (type !== "file") return;

    await deleteFile(content, password);
  };

  return (
    <>
      <Modal title="Delete entry" isOpen={isOpen} onClose={handleClose}>
        <Text>Are you sure you want to delete this entry?</Text>
        <Text>This action cannot be undone.</Text>
        {error && (
          <Text style={{ marginTop: 24, color: theme.colors.red[500] }}>
            {error}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 24,
          }}
        >
          <Button
            disabled={isLoading}
            onPress={handleClose}
            colorScheme="olive"
            style={{ marginRight: 16 }}
          >
            Cancel
          </Button>
          <Button onPress={handleSubmit} isLoading={isLoading}>
            Delete
          </Button>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: theme.colors.olive.DEFAULT,
          padding: 9,
          borderRadius: 8,
        }}
      >
        <TrashIcon size={24} color={theme.colors.floral.DEFAULT} />
      </TouchableOpacity>
    </>
  );
};

export default DeleteEntry;
