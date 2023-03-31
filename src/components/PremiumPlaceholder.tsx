import { useAuth } from "@contexts/AuthContext";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { TabList } from "src/Router";
import theme from "src/theme";
import Button from "./Button";

interface PremiumPlaceholderProps {
  message?: string;
  customCheck?: boolean;
}

const PremiumPlaceholder = ({
  children,
  message = "This is a premium feature!",
  customCheck,
}: PropsWithChildren<PremiumPlaceholderProps>) => {
  const { user } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<TabList>>();

  return (
    typeof customCheck === "boolean" ? customCheck : user?.plan !== "premium"
  ) ? (
    <View style={{ position: "relative", padding: 32 }}>
      {children}

      <View
        style={{
          backgroundColor: theme.colors.floral.DEFAULT,
          opacity: 0.95,
          zIndex: 50,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{message}</Text>
        <Text style={{ marginTop: 8 }}>
          You can upgrade to premium right now:
        </Text>
        <Button
          style={{ marginTop: 24 }}
          onPress={() => navigation.navigate("Upgrade")}
        >
          Upgrade
        </Button>
      </View>
    </View>
  ) : (
    <>{children}</>
  );
};

export default PremiumPlaceholder;
