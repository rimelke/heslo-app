import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useState } from "react";
import FreeCard from "@components/FreeCard";
import PremiumCard from "@components/PremiumCard";
import { WebView } from "react-native-webview";
import { useAuth } from "@contexts/AuthContext";
import theme from "src/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabList } from "src/Router";

const Upgrade = ({ navigation }: BottomTabScreenProps<TabList, "Upgrade">) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { token, setUser } = useAuth();

  const handleCheckoutChange = (url: string): boolean => {
    if (!url.includes("/login")) return true;

    setIsCheckoutOpen(false);

    if (url.includes("result=success")) {
      setUser((oldUser) => oldUser && { ...oldUser, plan: "premium" });
      navigation.navigate("Profile");
    }

    return false;
  };

  if (isCheckoutOpen)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          onShouldStartLoadWithRequest={(state) =>
            handleCheckoutChange(state.url)
          }
          source={{
            uri: `${
              process.env.API_URL || "http://10.0.2.2:3000/api"
            }/payments/checkout`,
            headers: {
              Cookie: `heslo.token=${token}`,
            },
          }}
          style={{ backgroundColor: theme.colors.floral.DEFAULT }}
          startInLoadingState
        />
      </SafeAreaView>
    );

  return (
    <ScreenContainer withScroll>
      <Title>Maybe an upgrade is</Title>
      <Title>what you need</Title>

      <FreeCard isActive />

      <PremiumCard onGoPremium={() => setIsCheckoutOpen(true)} />
    </ScreenContainer>
  );
};

export default Upgrade;
