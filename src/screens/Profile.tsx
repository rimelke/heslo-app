import Button from "@components/Button";
import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import { Image, Text, View } from "react-native";
import theme from "src/theme";

const Profile = () => {
  const { user } = useAuth();
  const { folders } = useFolders();

  return (
    <ScreenContainer>
      <Title>Your profile</Title>
      {user ? (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Image
            style={{ width: 120, height: 120, borderRadius: 60 }}
            source={{ uri: user.imageUrl }}
          />
          <Text
            style={{
              color: theme.colors.olive.DEFAULT,
              fontSize: 20,
              fontWeight: "500",
              marginTop: 16,
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: theme.colors.olive.DEFAULT,
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            {user.slogan}
          </Text>
          <Button colorScheme="olive">Change your password</Button>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.floral.dark,
              alignSelf: "stretch",
              margin: 24,
            }}
          />
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            <Text style={{ color: theme.colors.flame.DEFAULT }}>
              {user.plan === "free" ? "Free" : "Premium"}
            </Text>{" "}
            plan
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
            <Text style={{ color: theme.colors.flame.DEFAULT }}>
              {folders?.length}
            </Text>{" "}
            folder(s)
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
            <Text style={{ color: theme.colors.flame.DEFAULT }}>
              {folders?.reduce(
                (acc, folder) => acc + (folder.counts.text || 0),
                0
              )}
            </Text>{" "}
            text(s)
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
            <Text style={{ color: theme.colors.flame.DEFAULT }}>
              {folders?.reduce(
                (acc, folder) => acc + (folder.counts.file || 0),
                0
              )}
            </Text>{" "}
            file(s)
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
            Securing things since{" "}
            <Text style={{ color: theme.colors.flame.DEFAULT }}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </Text>
        </View>
      ) : (
        <Loading />
      )}
    </ScreenContainer>
  );
};

export default Profile;
