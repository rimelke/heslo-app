import Button from "@components/Button";
import Logo from "@components/Logo";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import Input from "@components/form/Input";
import { useAuth } from "@contexts/AuthContext";
import useAsync from "@hooks/useAsync";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api from "@services/api";
import { FormHandles } from "@unform/core/typings/types";
import { Form } from "@unform/mobile";
import aes256 from "@utils/aes256";
import getFormHandler from "@utils/getFormHandler";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Keychain from "react-native-keychain";
import * as opaque from "react-native-opaque";
import crypto from "react-native-quick-crypto";
import { AuthStackList } from "src/Router";
import theme from "src/theme";
import { z } from "zod";

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
  const { isLoading, adapt, error, setError } = useAsync();
  const { setPassword, setDefaultEmail, user, defaultEmail } = useAuth();

  const getIsEnrolled = async (): Promise<boolean> => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    return isEnrolled;
  };

  const handleSavePassword = async (email: string, password: string) => {
    try {
      const isEnrolled = await getIsEnrolled();

      if (!isEnrolled) return;

      const saltedData = crypto
        .createHash("sha256")
        .update(`${salt}${email.trim().toLowerCase()}`)
        .digest("base64");
      const encryptedPassword = aes256.encrypt(saltedData, password);

      await Keychain.setGenericPassword(email, encryptedPassword);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = adapt(async ({ email, password }: ILoginData) => {
    const { clientLoginState, startLoginRequest: loginRequest } =
      opaque.client.startLogin({ password });

    const { data } = await api.post("/auth/login/request", {
      loginRequest,
      email,
    });

    const { nonce, loginResponse } = data;

    const loginRecord = opaque.client.finishLogin({
      clientLoginState,
      loginResponse,
      password,
    });

    console.log({
      password,
      loginRequest,
      loginRecord,
      loginResponse,
      nonce,
      email,
      clientLoginState,
    });

    if (!loginRecord) {
      setError("Invalid password or email");

      return;
    }

    await api.post("/auth/login/record", {
      nonce,
      loginRecord: loginRecord.finishLoginRequest,
    });

    await handleSavePassword(email, password);
    setDefaultEmail(email);
    setPassword(password);
  });

  useEffect(() => {
    const checkForLocalAuth = async () => {
      try {
        const email = user?.email || defaultEmail;

        if (!email) return;

        const genericPassword = await Keychain.getGenericPassword();

        if (!genericPassword || genericPassword.username !== email) return;

        const isEnrolled = await getIsEnrolled();
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
