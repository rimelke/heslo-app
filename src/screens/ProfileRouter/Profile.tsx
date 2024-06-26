import Button from "@components/Button";
import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import Title from "@components/Title";
import { useAuth } from "@contexts/AuthContext";
import { useFolders } from "@contexts/FoldersContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import theme from "src/theme";
import { ProfileStackList } from ".";

const Profile = ({
  navigation,
}: NativeStackScreenProps<ProfileStackList, "Profile">) => {
  const { user, logout } = useAuth();
  const { folders } = useFolders();
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  if (!user) return <Loading />;

  const handleCheckoutChange = (url: string): boolean => {
    if (!url.includes("result=")) return true;

    setIsPaymentsOpen(false);

    return false;
  };

  if (isPaymentsOpen)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          onShouldStartLoadWithRequest={(state) =>
            handleCheckoutChange(state.url)
          }
          source={{
            uri: `${
              process.env.API_URL || "http://10.0.2.2:3000/api"
            }/payments/portal?returnUrl=true`,
          }}
          style={{ backgroundColor: theme.colors.floral.DEFAULT }}
          startInLoadingState
        />
      </SafeAreaView>
    );

  return (
    <ScreenContainer withScroll>
      <Title>Your profile</Title>
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
        <Button
          colorScheme="olive"
          onPress={() => navigation.navigate("ChangePassword")}
        >
          Change your password
        </Button>
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

        {user.paymentId && (
          <Button
            style={{
              marginTop: 24,
            }}
            colorScheme="olive"
            onPress={() => setIsPaymentsOpen(true)}
          >
            Access payments
          </Button>
        )}

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.floral.dark,
            alignSelf: "stretch",
            margin: 24,
          }}
        />
        <Button
          style={{ paddingHorizontal: 48 }}
          colorScheme="olive"
          onPress={logout}
        >
          Log out
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default Profile;
