import api from "@services/api";
import aes256 from "./aes256";

const deleteFile = async (content: string, password: string) => {
  try {
    const url = aes256.decrypt(password, content);

    await api.delete(
      `/upload/${encodeURIComponent(
        url.replace(process.env.FILES_CDN_URL as string, "")
      )}`
    );
  } catch (err) {
    console.error(err);
  }
};

export default deleteFile;
