import Button from "@components/Button";
import Input from "@components/form/Input";
import Logo from "@components/Logo";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import useRequest from "@hooks/useRequest";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import getFormHandler from "@utils/getFormHandler";
import { useRef } from "react";
import { Text, View } from "react-native";
import { AuthStackList } from "src/Router";
import theme from "src/theme";
import { z } from "zod";

interface ISignupData {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const Signup = ({
  navigation,
}: NativeStackScreenProps<AuthStackList, "Signup">) => {
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest("/users");
  const { defaultEmail, setDefaultEmail } = useAuth();

  const handleSubmit = async ({
    repeatPassword: _repeatPassword,
    ...data
  }: ISignupData) => {
    const result = await sendRequest(data);

    if (!result) return;

    setDefaultEmail(data.email);
    navigation.navigate("Success");
  };

  const formHandler = getFormHandler<ISignupData>(
    formRef,
    z.object({
      email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email"),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters long"),
      name: z.string({ required_error: "Name is required" }),
      repeatPassword: z
        .string({ required_error: "Repeat password is required" })
        .refine(
          (value) => value === formRef.current?.getFieldValue("password"),
          "Passwords must match"
        ),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer withScroll>
      <Form
        ref={formRef}
        onSubmit={formHandler}
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={{ height: 60, marginBottom: 48 }}>
          <Logo />
        </View>
        <Title>Sign up</Title>
        <Text style={{ marginTop: 24, fontWeight: "600", fontSize: 16 }}>
          Have an account?{" "}
          <Text
            onPress={() => navigation.replace("Login", { defaultEmail })}
            style={{ color: theme.colors.flame.DEFAULT }}
          >
            Login
          </Text>
        </Text>
        <Input
          label="Name"
          name="name"
          style={{ marginTop: 24 }}
          placeholder="Name"
        />
        <Input
          label="Email"
          name="email"
          style={{ marginTop: 12 }}
          placeholder="Email"
        />
        <Input
          label="Password"
          name="password"
          style={{ marginTop: 12 }}
          placeholder="Password"
          secureTextEntry
        />
        <Input
          label="Repeat password"
          name="repeatPassword"
          style={{ marginTop: 12 }}
          placeholder="Repeat password"
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
          Sign up
        </Button>
      </Form>
    </ScreenContainer>
  );
};

export default Signup;
