import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";

export type ProfileStackList = {
  Profile: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackList>();

const ProfileRouter = () => (
  <Stack.Navigator
    initialRouteName="Profile"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
  </Stack.Navigator>
);

export default ProfileRouter;
