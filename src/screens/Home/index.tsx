import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { View } from "react-native";
import CountsSection from "./CountsSection";
import LastSection from "./LastSection";
import RecentSection from "./RecentSection";

const Home = () => {
  const { user } = useAuth();

  return (
    <ScreenContainer withScroll>
      <Title>Welcome back, {user?.name}!</Title>

      <CountsSection />

      <View style={{ marginTop: 24 }}>
        <LastSection />

        <RecentSection />
      </View>
    </ScreenContainer>
  );
};

export default Home;
