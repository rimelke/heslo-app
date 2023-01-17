import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Text } from "react-native";
import { useAuth } from "@contexts/AuthContext";
import ScreenContainer from "@components/ScreenContainer";
import Input from "@components/form/Input";
import Button from "@components/Button";
import Title from "@components/Title";
import Logo from "@components/Logo";
import theme from "../theme";
import { Form } from "@unform/mobile";
import { useRef } from "react";
import { FormHandles } from "@unform/core/typings/types";
import useRequest from "@hooks/useRequest";
import getFormHandler from "@utils/getFormHandler";
import { z } from "zod";
import { AuthStackList } from "src/Router";
import asyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_EMAIL_KEY, TOKEN_KEY } from "src/constants/keys";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

interface ILoginData {
  email: string;
  password: string;
}

const Login = ({
  route,
  navigation,
}: NativeStackScreenProps<AuthStackList, "Login">) => {
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest("/users/login");
  const { setPassword, setToken } = useAuth();

  const handleSubmit = async (data: ILoginData) => {
    const result = await sendRequest(data);

    if (!result) return;

    asyncStorage.setItem(DEFAULT_EMAIL_KEY, data.email);
    setToken(result.token);
    setPassword(data.password);
  };

  const formHandler = getFormHandler<ILoginData>(
    formRef,
    z.object({
      email: z.string({ required_error: "Email is required" }).email(),
      password: z.string({ required_error: "Password is required" }),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer>
      <Form
        ref={formRef}
        onSubmit={formHandler}
        style={styles.container}
        initialData={{ email: route.params?.defaultEmail }}
      >
        <View style={{ height: 60, marginBottom: 48 }}>
          <Logo />
        </View>
        <Title>Login</Title>
        <Text style={{ marginTop: 24, fontWeight: "600", fontSize: 16 }}>
          Don't have an account?{" "}
          <Text
            onPress={() => navigation.replace("Signup")}
            style={{ color: theme.colors.flame.DEFAULT }}
          >
            Sign up
          </Text>
        </Text>
        <Input
          label="Email"
          name="email"
          style={{ marginTop: 24 }}
          placeholder="Email"
        />
        <Input
          label="Password"
          name="password"
          style={{ marginTop: 12 }}
          placeholder="Password"
          secureTextEntry
        />
        {error && (
          <Text style={{ color: theme.colors.red[500], marginTop: 24 }}>
            {error}
          </Text>
        )}
        <Button
          isLoading={isLoading}
          onPress={() => formRef.current?.submitForm()}
          style={{ marginTop: 24 }}
        >
          Login
        </Button>
      </Form>
    </ScreenContainer>
  );
};

export default Login;
