import AsyncStorage from "@react-native-async-storage/async-storage";
import { LAST_IDS_KEY } from "src/constants/keys";

const addLastId = async (entryId: string) => {
  const rawLastIds = await AsyncStorage.getItem(LAST_IDS_KEY);

  const lastIds: string[] = rawLastIds ? JSON.parse(rawLastIds) : [];

  await AsyncStorage.setItem(
    LAST_IDS_KEY,
    JSON.stringify([
      entryId,
      ...lastIds.filter((id) => id !== entryId).slice(0, 4),
    ])
  );
};

export default addLastId;
