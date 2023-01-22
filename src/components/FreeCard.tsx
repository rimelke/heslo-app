import Button from "@components/Button";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "react-native-heroicons/solid";
import theme from "src/theme";

interface ItemProps {
  type?: "success" | "warn" | "error";
}

const itemOpacity = {
  success: 1,
  warn: 0.7,
  error: 0.4,
};

const itemIcons = {
  success: CheckCircleIcon,
  warn: MinusCircleIcon,
  error: XCircleIcon,
};

const Item = ({ children, type = "success" }: PropsWithChildren<ItemProps>) => {
  const Icon = itemIcons[type];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: itemOpacity[type],
      }}
    >
      <Icon size={24} color={theme.colors.olive.dark} />
      <Text
        style={{
          marginLeft: 8,
          color: theme.colors.olive.dark,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

interface FreeCardProps {
  isActive?: boolean;
  startFreeAction?: () => void;
}

const FreeCard = ({ isActive, startFreeAction }: FreeCardProps) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: theme.colors.olive.DEFAULT,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 24,
      paddingVertical: 16,
      width: "80%",
      alignSelf: "center",
    }}
  >
    <Text style={{ fontSize: 20, fontWeight: "500" }}>Free</Text>
    <View style={{ marginTop: 16 }}>
      <Item>Any device</Item>
      <Item type="warn">20 passwords</Item>
      <Item type="warn">1 folder</Item>
      <Item type="error">No files</Item>
      <Item type="error">No groups</Item>
    </View>
    {isActive ? (
      <View
        style={{
          backgroundColor: theme.colors.olive.disabled,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 24,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckCircleIcon size={24} color={theme.colors.floral.DEFAULT} />
        <Text style={{ marginLeft: 8, color: theme.colors.floral.DEFAULT }}>
          Current plan
        </Text>
      </View>
    ) : (
      <Button
        onPress={startFreeAction}
        colorScheme="olive"
        style={{ marginTop: 24 }}
      >
        Start free
      </Button>
    )}
  </View>
);

export default FreeCard;
