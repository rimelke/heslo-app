import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Text } from "react-native";
import { AuthStackList } from "../contexts/AuthContext";
import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/form/Input";
import Button from "../components/Button";
import Title from "../components/Title";
import Logo from "../components/Logo";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

const Login = ({
  route,
  navigation,
}: NativeStackScreenProps<AuthStackList, "Login">) => (
  <ScreenContainer>
    <View style={styles.container}>
      <View style={{ height: 60, marginBottom: 48 }}>
        <Logo />
      </View>
      <Title>Login</Title>
      <Text
        style={{ marginTop: 24, fontWeight: "600" }}
        onPress={() => navigation.push("Signup")}
      >
        Don't have an account?{" "}
        <Text style={{ color: theme.colors.flame.DEFAULT }}>Sign up</Text>
      </Text>
      <Input
        style={{ marginTop: 24 }}
        placeholder="Email"
        defaultValue={route.params?.defaultEmail}
      />
      <Input style={{ marginTop: 12 }} placeholder="Password" />
      <Button style={{ marginTop: 24 }}>Login</Button>
    </View>
  </ScreenContainer>
);

export default Login;
