import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { ScrollView } from "react-native";
import CountsSection from "./CountsSection";
import LastSection from "./LastSection";
import RecentSection from "./RecentSection";

const Home = () => {
  const { user } = useAuth();

  return (
    <ScreenContainer>
      <Title>Welcome back, {user?.name}!</Title>

      <CountsSection />

      <ScrollView style={{ marginTop: 24 }}>
        <LastSection />

        <RecentSection />
      </ScrollView>
    </ScreenContainer>
  );
};

export default Home;
