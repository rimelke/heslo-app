import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import useGet from "@hooks/useGet";
import IEntry from "src/types/IEntry";
import CountsSection from "./CountsSection";
import LastSection from "./LastSection";
import RecentSection from "./RecentSection";

const Home = () => {
  const { user } = useAuth();

  return (
    <ScreenContainer>
      <Title>Welcome back, {user?.name}!</Title>

      <CountsSection />

      <LastSection />

      <RecentSection />
    </ScreenContainer>
  );
};

export default Home;
