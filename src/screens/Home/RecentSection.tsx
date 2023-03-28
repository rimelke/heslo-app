import Loading from "@components/Loading";
import useGet from "@hooks/useGet";
import { View } from "react-native";
import IEntry from "src/types/IEntry";
import EntriesList from "./EntriesList";

const RecentSection = () => {
  const { data: recentEntries = [], isLoading: isRecentLoading } = useGet<
    IEntry[]
  >("/entries?sort=createdAt_desc");

  if (isRecentLoading)
    return (
      <View style={{ marginTop: 24 }}>
        <Loading />
      </View>
    );

  return (
    <View style={{ marginTop: 24 }}>
      <EntriesList entries={recentEntries} title="Most recent" />
    </View>
  );
};

export default RecentSection;
