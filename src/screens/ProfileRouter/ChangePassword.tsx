import BackArrow from "@components/BackArrow";
import Button from "@components/Button";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import Input from "@components/form/Input";
import { useAuth } from "@contexts/AuthContext";
import { IFolder, useFolders } from "@contexts/FoldersContext";
import useAsync from "@hooks/useAsync";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api from "@services/api";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import aes256 from "@utils/aes256";
import getFormHandler from "@utils/getFormHandler";
import { useRef } from "react";
import { Text, View } from "react-native";
import * as opaque from "react-native-opaque";
import theme from "src/theme";
import IEntry from "src/types/IEntry";
import IGroup from "src/types/IGroup";
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
  const { folders } = useFolders();
  const { isLoading, adapt, error, setError } = useAsync();
  const { setPassword } = useAuth();

  const handleSubmit = adapt(
    async ({ newPassword, oldPassword }: ChangePasswordData) => {
      let usedFolders: IFolder[] | undefined = folders;
      if (!usedFolders) {
        const { data: newFolders } = await api.get<IFolder[]>("/folders");

        usedFolders = newFolders;
      }

      const entries = (
        await Promise.all(
          usedFolders.map(async (folder) => {
            const { data } = await api.get<(IEntry | IGroup)[]>(
              `/folders/${folder.id}/entries`
            );

            return data.reduce<IEntry[]>(
              (acc, item) => [
                ...acc,
                ...("entries" in item ? item.entries : [item]),
              ],
              []
            );
          })
        )
      ).flat();

      const { clientLoginState, startLoginRequest: loginRequest } =
        opaque.client.startLogin({ password: oldPassword });
      const { clientRegistrationState, registrationRequest } =
        opaque.client.startRegistration({ password: newPassword });

      const {
        data: { loginResponse, registrationResponse, nonce },
      } = await api.post("/auth/password/request", {
        loginRequest,
        registrationRequest,
      });

      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        password: newPassword,
        registrationResponse,
      });
      const loginResult = opaque.client.finishLogin({
        clientLoginState,
        loginResponse,
        password: oldPassword,
      });

      if (!loginResult) {
        setError("Invalid old password");

        return;
      }

      await api.post("/auth/password/record", {
        nonce,
        loginRecord: loginResult.finishLoginRequest,
        registrationRecord,
        entries: entries.map((entry) => ({
          id: entry.id,
          title: aes256.encrypt(
            newPassword,
            aes256.decrypt(oldPassword, entry.title)
          ),
          content: aes256.encrypt(
            newPassword,
            aes256.decrypt(oldPassword, entry.content)
          ),
          userName: entry.userName
            ? aes256.encrypt(
                newPassword,
                aes256.decrypt(oldPassword, entry.userName)
              )
            : null,
          url: entry.url
            ? aes256.encrypt(
                newPassword,
                aes256.decrypt(oldPassword, entry.url)
              )
            : null,
        })),
      });

      setPassword(newPassword);
      onChangePassword(oldPassword, newPassword);
      navigation.navigate("Profile");
    }
  );

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
