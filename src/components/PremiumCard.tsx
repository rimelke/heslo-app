import Button from "@components/Button";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import theme from "src/theme";

const Item = ({ children }: PropsWithChildren<{}>) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <CheckCircleIcon size={24} color={theme.colors.floral.DEFAULT} />
      <Text
        style={{
          marginLeft: 8,
          color: theme.colors.floral.DEFAULT,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

interface PremiumCardProps {
  onGoPremium: () => void;
}

const PremiumCard = ({ onGoPremium }: PremiumCardProps) => (
  <View
    style={{
      borderRadius: 8,
      alignItems: "center",
      marginTop: 24,
      paddingVertical: 16,
      width: "80%",
      alignSelf: "center",
      backgroundColor: theme.colors.flame.DEFAULT,
    }}
  >
    <Text
      style={{
        fontSize: 20,
        fontWeight: "500",
        color: theme.colors.floral.DEFAULT,
      }}
    >
      Premium
    </Text>
    <View style={{ marginTop: 16 }}>
      <Item>Any device</Item>
      <Item>Unlimited passwords</Item>
      <Item>Unlimited folders</Item>
      <Item>Unlimited files</Item>
      <Item>Unlimited groups</Item>
    </View>
    <Button
      onPress={onGoPremium}
      style={{ marginTop: 24 }}
      colorScheme="floral"
    >
      Go premium
    </Button>
  </View>
);

export default PremiumCard;
