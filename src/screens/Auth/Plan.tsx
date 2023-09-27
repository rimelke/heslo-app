import FreeCard from "@components/FreeCard";
import PremiumCard from "@components/PremiumCard";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { parse } from "expo-linking";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { AuthStackList } from "src/Router";
import theme from "src/theme";

const Plan = ({
  navigation,
}: NativeStackScreenProps<AuthStackList, "Plan">) => {
  const { defaultEmail, setUser } = useAuth();
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const handleCheckoutChange = (url: string): boolean => {
    if (!url.includes("/login")) return true;

    setIsPremiumOpen(false);

    if (url.includes("result=success")) {
      setUser((oldUser) => oldUser && { ...oldUser, plan: "premium" });
      const rawEmail = parse(url).queryParams?.email;
      const email = typeof rawEmail === "string" ? rawEmail : undefined;
      navigation.navigate("Login", { defaultEmail: email || defaultEmail });
    }

    return false;
  };

  if (isPremiumOpen)
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
          }}
          style={{ backgroundColor: theme.colors.floral.DEFAULT }}
          startInLoadingState
        />
      </SafeAreaView>
    );

  return (
    <ScreenContainer withScroll>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title>Select a plan that fits your needs</Title>

        <FreeCard
          startFreeAction={() => navigation.navigate("Login", { defaultEmail })}
        />

        <PremiumCard onGoPremium={() => setIsPremiumOpen(true)} />
      </View>
    </ScreenContainer>
  );
};

export default Plan;
