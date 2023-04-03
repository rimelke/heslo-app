import Button from "@components/Button";
import Logo from "@components/Logo";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { InboxIcon } from "react-native-heroicons/solid";
import { AuthStackList } from "src/Router";
import theme from "src/theme";
import { openInbox } from "react-native-email-link";

const Success = ({
  navigation,
}: NativeStackScreenProps<AuthStackList, "Success">) => {
  const { defaultEmail } = useAuth();

  return (
    <ScreenContainer withScroll>
      <View
        style={{
          flex: 1,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignSelf: "stretch", height: 60, marginBottom: 48 }}>
          <Logo />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <InboxIcon
            size={36}
            style={{ marginRight: 16 }}
            color={theme.colors.flame.DEFAULT}
          />
          <Title>Check your inbox!</Title>
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
          style={{ marginTop: 48, paddingHorizontal: 64 }}
          onPress={() => openInbox()}
        >
          Open email app
        </Button>

        <Text style={{ marginTop: 18, color: theme.colors.floral.dark }}>
          or
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login", { defaultEmail })}
        >
          <Text
            style={{
              marginTop: 18,
              color: theme.colors.flame.DEFAULT,
              textDecorationLine: "underline",
            }}
          >
            Go to login
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default Success;
