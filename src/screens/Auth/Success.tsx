import Button from "@components/Button";
import Logo from "@components/Logo";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { InboxIcon } from "react-native-heroicons/solid";
import { AuthStackList } from "src/Router";
import theme from "src/theme";

const Success = ({
  navigation,
}: NativeStackScreenProps<AuthStackList, "Success">) => {
  const { defaultEmail } = useAuth();

  return (
    <ScreenContainer withScroll>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ alignSelf: "stretch", height: 60, marginBottom: 48 }}>
          <Logo />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <InboxIcon
            size={36}
            style={{ marginRight: 16 }}
            color={theme.colors.flame.DEFAULT}
          />
          <Title>Congratulations!</Title>
        </View>

        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: theme.colors.olive.DEFAULT,
          }}
        >
          We sent you an email to activate your account, please check your
          inbox.
        </Text>
        <Button
          style={{ marginTop: 36, paddingHorizontal: 64 }}
          onPress={() => navigation.navigate("Login", { defaultEmail })}
        >
          Go to login
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default Success;
