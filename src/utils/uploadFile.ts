import { FileType } from "@components/form/Upload";
import api from "@services/api";
import * as FileSystem from "expo-file-system";

const uploadFile = async (rawFile: FileType) => {
  const { data } = await api.post("/upload", {
    fileName: rawFile.name,
  });

  await FileSystem.uploadAsync(data.url, rawFile.uri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      "Content-Type": rawFile.type,
    },
  });

  return encodeURI(`${process.env.FILES_CDN_URL}${data.path}`);
};

export default uploadFile;
