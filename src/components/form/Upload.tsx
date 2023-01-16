import { Text, TouchableOpacity, View } from "react-native";
import { DocumentPlusIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useRef, useState } from "react";
import { useField } from "@unform/core";

export interface FileType {
  name: string;
  type: string;
  uri: string;
}

interface UploadProps {
  name: string;
}

const Upload = ({ name }: UploadProps) => {
  const fileRef = useRef<FileType>();
  const [selectedFile, setSelectedFile] = useState<FileType>();
  const { clearError, error, fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => fileRef.current,
      clearValue: () => {
        fileRef.current = undefined;
        setSelectedFile(undefined);
      },
      setValue: (_, value: FileType | undefined) => {
        fileRef.current = value;
        setSelectedFile(value);
      },
    });
  }, [fieldName, registerField]);

  const handleSelectFile = async () => {
    clearError();
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.type === "cancel" || !result.mimeType) return;

    const file: FileType = {
      name: result.name,
      type: result.mimeType,
      uri: result.uri,
    };

    fileRef.current = file;
    setSelectedFile(file);
  };

  return (
    <View style={{ alignItems: "center", paddingVertical: 8 }}>
      <TouchableOpacity
        onPress={handleSelectFile}
        style={{ alignItems: "center" }}
      >
        <DocumentPlusIcon size={40} color={theme.colors.olive.DEFAULT} />
        <Text style={{ marginTop: 8, fontSize: 16 }}>Select a file</Text>
      </TouchableOpacity>
      {selectedFile && (
        <Text style={{ marginTop: 8, color: theme.colors.flame.DEFAULT }}>
          {selectedFile.name}
        </Text>
      )}
      {error && (
        <Text style={{ marginTop: 8, color: theme.colors.red[500] }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Upload;