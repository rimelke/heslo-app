import Button from "@components/Button";
import ScreenContainer from "@components/ScreenContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { AuthStackList } from "src/Router";

const Signup = ({
  navigation,
}: NativeStackScreenProps<AuthStackList, "Signup">) => (
  <ScreenContainer>
    <Text>Signup</Text>
    <Button onPress={() => navigation.navigate("Login", {})}>Login</Button>
  </ScreenContainer>
);

export default Signup;
