import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabList } from "src/Router";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";

export type ProfileStackList = {
  Profile: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackList>();

interface ProfileRouterProps
  extends BottomTabScreenProps<TabList, "ProfileRouter"> {
  updateEntriesPassword: (oldPassword: string, newPassword: string) => void;
}

const ProfileRouter = ({ updateEntriesPassword }: ProfileRouterProps) => (
  <Stack.Navigator
    initialRouteName="Profile"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ChangePassword">
      {(props) => (
        <ChangePassword {...props} onChangePassword={updateEntriesPassword} />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

export default ProfileRouter;
