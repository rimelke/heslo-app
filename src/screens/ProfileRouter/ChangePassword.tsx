import BackArrow from "@components/BackArrow";
import Button from "@components/Button";
import Input from "@components/form/Input";
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
import theme from "src/theme";
import { z } from "zod";
import { ProfileStackList } from ".";

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

interface ChangePasswordProps
  extends NativeStackScreenProps<ProfileStackList, "ChangePassword"> {
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}

const ChangePassword = ({
  navigation,
  onChangePassword,
}: ChangePasswordProps) => {
  const formRef = useRef<FormHandles>(null);
  const { error, isLoading, sendRequest } = useRequest(
    "/users/password",
    "patch"
  );
  const { setPassword } = useAuth();

  const handleSubmit = async (data: ChangePasswordData) => {
    const wasSuccessful = await sendRequest({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });

    if (!wasSuccessful) return;

    setPassword(data.newPassword);
    onChangePassword(data.oldPassword, data.newPassword);
    navigation.navigate("Profile");
  };

  const formHandler = getFormHandler<ChangePasswordData>(
    formRef,
    z.object({
      oldPassword: z.string({ required_error: "Old password is required" }),
      newPassword: z
        .string({ required_error: "New password is required" })
        .min(8, "New password must be at least 8 characters long")
        .refine(
          (value) => value !== formRef.current?.getFieldValue("oldPassword"),
          "New password must be different from old password"
        ),
      repeatPassword: z
        .string({
          required_error: "Repeat new password is required",
        })
        .refine(
          (value) => value === formRef.current?.getFieldValue("newPassword"),
          "Passwords do not match"
        ),
    }),
    handleSubmit
  );

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow />

        <Title>Change your password</Title>
      </View>
      <Form ref={formRef} onSubmit={formHandler} style={{ marginTop: 24 }}>
        <Input
          name="oldPassword"
          label="Old password"
          secureTextEntry
          placeholder="Old password"
        />
        <Input
          secureTextEntry
          style={{
            marginTop: 24,
            marginBottom: 8,
          }}
          name="newPassword"
          label="New password"
          placeholder="New password"
        />
        <Input
          name="repeatPassword"
          secureTextEntry
          label="Repeat new password"
          placeholder="Repeat new password"
          style={{ marginBottom: 24 }}
        />
        {error && (
          <Text style={{ color: theme.colors.red[500], marginBottom: 24 }}>
            {error}
          </Text>
        )}
        <Button
          isLoading={isLoading}
          onPress={() => formRef.current?.submitForm()}
        >
          Change password
        </Button>
      </Form>
    </ScreenContainer>
  );
};

export default ChangePassword;
