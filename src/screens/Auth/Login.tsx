import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Text } from "react-native";
import { useAuth } from "@contexts/AuthContext";
import ScreenContainer from "@components/ScreenContainer";
import Input from "@components/form/Input";
import Button from "@components/Button";
import Title from "@components/Title";
import Logo from "@components/Logo";
import theme from "src/theme";
import { Form } from "@unform/mobile";
import { useEffect, useRef } from "react";
import { FormHandles } from "@unform/core/typings/types";
import useRequest from "@hooks/useRequest";
import getFormHandler from "@utils/getFormHandler";
import { z } from "zod";
import { AuthStackList } from "src/Router";
import * as LocalAuthentication from "expo-local-authentication";
import * as Keychain from "react-native-keychain";
import crypto from "react-native-quick-crypto";
import aes256 from "@utils/aes256";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

const salt = "4fea4a8a2d205e135e00907d80b8507abe8164bf";

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
  const { setPassword, setToken, setDefaultEmail, user, defaultEmail } =
    useAuth();

  const handleSubmit = async (data: ILoginData) => {
    const result = await sendRequest(data);

    if (!result) return;

    const saltedData = crypto
      .createHash("sha256")
      .update(`${salt}${data.email.trim().toLowerCase()}`)
      .digest("base64");
    const encryptedPassword = aes256.encrypt(saltedData, data.password);

    await Keychain.setGenericPassword(data.email, encryptedPassword);
    setDefaultEmail(data.email);
    setToken(result.token);
    setPassword(data.password);
  };

  useEffect(() => {
    const checkForLocalAuth = async () => {
      try {
        const email = user?.email || defaultEmail;

        if (!email) return;

        const genericPassword = await Keychain.getGenericPassword();

        if (!genericPassword || genericPassword.username !== email) return;

        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) return;

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) return;

        const result = await LocalAuthentication.authenticateAsync();
        if (!result.success) return;

        const saltedData = crypto
          .createHash("sha256")
          .update(`${salt}${email.trim().toLowerCase()}`)
          .digest("base64");

        const password = aes256.decrypt(saltedData, genericPassword.password);

        handleSubmit({ email, password });
      } catch (err) {
        console.error(err);
      }
    };

    checkForLocalAuth();
  }, []);

  const formHandler = getFormHandler<ILoginData>(
    formRef,
    z.object({
      email: z.string({ required_error: "Email is required" }).email(),
      password: z.string({ required_error: "Password is required" }),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer withScroll>
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
