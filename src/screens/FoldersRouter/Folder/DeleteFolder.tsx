import Button from "@components/Button";
import Modal from "@components/Modal";
import { useFolders } from "@contexts/FoldersContext";
import useRequest from "@hooks/useRequest";
import { useState } from "react";
import { Text, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
import theme from "src/theme";

interface DeleteFolderProps {
  folderId: string;
  goToFolders: () => void;
}

const DeleteFolder = ({ folderId, goToFolders }: DeleteFolderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { error, isLoading, sendRequest } = useRequest(
    `/folders/${folderId}`,
    "delete"
  );
  const { removeFolder } = useFolders();

  const handleSubmit = async () => {
    const wasSuccessful = await sendRequest();

    if (!wasSuccessful) return;

    setIsOpen(false);
    goToFolders();
    removeFolder(folderId);
  };

  return (
    <>
      <Modal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        title="Delete folder"
      >
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
            onPress={() => setIsOpen(false)}
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
      <Button
        onPress={() => setIsOpen(true)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          marginLeft: 8,
        }}
        colorScheme="olive"
      >
        <TrashIcon size={16} color={theme.colors.floral.DEFAULT} />
      </Button>
    </>
  );
};

export default DeleteFolder;
