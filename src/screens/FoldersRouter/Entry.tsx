import BackArrow from "@components/BackArrow";
import Input from "@components/form/Input";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Form } from "@unform/mobile";
import { View } from "react-native";
import { FoldersStackList } from ".";
import aes256 from "aes256";
import { useAuth } from "@contexts/AuthContext";
import { useEffect } from "react";

const Entry = ({
  route,
}: NativeStackScreenProps<FoldersStackList, "Entry">) => {
  const { entry } = route.params;
  const { password } = useAuth();

  useEffect(() => {
    console.log("content", entry.content);
    console.log("password", password);
    console.log("decrypted", aes256.decrypt(password || "", entry.content));
    console.log(
      "encrypted",
      aes256.encrypt(
        password || "",
        aes256.decrypt(password || "", entry.content)
      )
    );
  }, [entry]);

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackArrow />

        <Title>{entry.title}</Title>
      </View>
      <Form
        style={{ marginTop: 24 }}
        initialData={{
          ...entry,
          content: aes256.decrypt(password || "", entry.content),
        }}
        onSubmit={() => {}}
      >
        <Input name="title" label="Title" placeholder="Type the title" />
        <Input
          style={{ marginTop: 16 }}
          name="content"
          label="Content"
          placeholder="Type the content"
        />
      </Form>
    </ScreenContainer>
  );
};

export default Entry;
