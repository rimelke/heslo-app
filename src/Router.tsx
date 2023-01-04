import { useAuth } from "@contexts/AuthContext";
import { FoldersProvider } from "@contexts/FoldersContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FoldersRouter from "@screens/FoldersRouter";
import Home from "@screens/Home";
import Login from "@screens/Login";
import Profile from "@screens/Profile";
import Signup from "@screens/Signup";
import { ComponentType } from "react";
import { FolderIcon, HomeIcon, UserIcon } from "react-native-heroicons/solid";
import theme from "./theme";

export type TabList = {
  Home: undefined;
  FoldersRouter: undefined;
  Profile: undefined;
};

export type AuthStackList = {
  Login: { defaultEmail?: string };
  Signup: undefined;
};

const Tabs = createBottomTabNavigator<TabList>();
const Stack = createNativeStackNavigator<AuthStackList>();

interface ITab {
  name: keyof TabList;
  component: any;
  icon: ComponentType<{
    size: number;
    color: string;
  }>;
}

const tabs: ITab[] = [
  {
    name: "Home",
    component: Home,
    icon: HomeIcon,
  },
  {
    name: "FoldersRouter",
    component: FoldersRouter,
    icon: FolderIcon,
  },
  {
    name: "Profile",
    component: Profile,
    icon: UserIcon,
  },
];

const Router = () => {
  const { isAuthenticated, defaultEmail } = useAuth();

  if (!isAuthenticated)
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={defaultEmail ? "Login" : "Signup"}
      >
        <Stack.Screen
          initialParams={{ defaultEmail }}
          name="Login"
          component={Login}
        />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    );

  return (
    <FoldersProvider>
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.colors.flame.DEFAULT,
          tabBarInactiveTintColor: theme.colors.floral.dark,
          tabBarStyle: {
            elevation: 0,
            backgroundColor: theme.colors.floral.DEFAULT,
            height: 60,
            borderTopColor: theme.colors.floral.dark,
            borderTopWidth: 1,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            options={{
              tabBarIcon: ({ color, size }) => (
                <tab.icon size={size} color={color} />
              ),
            }}
            name={tab.name}
            component={tab.component}
          />
        ))}
      </Tabs.Navigator>
    </FoldersProvider>
  );
};

export default Router;
