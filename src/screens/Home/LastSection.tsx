import Loading from "@components/Loading";
import useGet from "@hooks/useGet";
import useStorage from "@hooks/useStorage";
import { View } from "react-native";
import { LAST_IDS_KEY } from "src/constants/keys";
import IEntry from "src/types/IEntry";
import EntriesList from "./EntriesList";

const LastSection = () => {
  const { value: lastIds, isReady } = useStorage<string[]>(LAST_IDS_KEY);

  const { data: lastEntries = [], isLoading: isLastLoading } = useGet<IEntry[]>(
    "/entries",
    [!!lastIds],
    {
      ids: lastIds,
    }
  );

  const sortedLastEntries = lastIds
    ? lastEntries.sort((a, b) => lastIds.indexOf(a.id) - lastIds.indexOf(b.id))
    : lastEntries;

  if (isLastLoading && !isReady) return <Loading />;

  return <EntriesList title="Last accessed" entries={sortedLastEntries} />;
};

export default LastSection;
