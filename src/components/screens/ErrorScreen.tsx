import Button from "@components/Button";
import Logo from "@components/Logo";
import ScreenContainer from "@components/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { AuthStackList } from "src/Router";
import theme from "src/theme";

interface ErrorScreenProps {
  error: string;
}

const ErrorScreen = ({ error }: ErrorScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackList>>();

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ height: 60, marginBottom: 48 }}>
          <Logo />
        </View>
        <Text
          style={{
            color: theme.colors.olive.DEFAULT,
            marginBottom: 24,
            fontSize: 16,
          }}
        >
          Oh, no! Something went wrong. Please try again or contact support.
        </Text>
        <Text
          style={{
            color: theme.colors.red[500],
            marginBottom: 24,
            fontSize: 16,
          }}
        >
          Error: {error}
        </Text>
        <Button onPress={() => navigation.navigate("Login", {})}>
          Go to login
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default ErrorScreen;
