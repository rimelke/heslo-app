import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { AuthStackList } from "../contexts/AuthContext";

const Login = ({ route }: NativeStackScreenProps<AuthStackList, "Login">) => (
  <View>
    <Text>Login</Text>
    <Text>{route.params?.defaultEmail}</Text>
  </View>
);

export default Login;
