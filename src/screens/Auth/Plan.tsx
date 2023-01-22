import FreeCard from "@components/FreeCard";
import PremiumCard from "@components/PremiumCard";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import { AuthStackList } from "src/Router";

const Plan = ({
  navigation,
}: NativeStackScreenProps<AuthStackList, "Plan">) => {
  const { defaultEmail } = useAuth();
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  return (
    <ScreenContainer>
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
