import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { registerRootComponent } from "expo";
import Home from "./screens/Home";
import { FolderIcon, HomeIcon, UserIcon } from "react-native-heroicons/solid";
import theme from "./theme";
import { ComponentType } from "react";
import Folders from "./screens/Folders";
import Profile from "./screens/Profile";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "./contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tabs = createBottomTabNavigator();

export type TabList = {
  Home: undefined;
  Folders: undefined;
  Profile: undefined;
};

interface ITab {
  name: keyof TabList;
  component: ComponentType;
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
    name: "Folders",
    component: Folders,
    icon: FolderIcon,
  },
  {
    name: "Profile",
    component: Profile,
    icon: UserIcon,
  },
];

SplashScreen.preventAutoHideAsync();

const App = () => (
  <NavigationContainer
    theme={{
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.colors.floral.DEFAULT,
        border: theme.colors.floral.dark,
        text: theme.colors.olive.DEFAULT,
        primary: theme.colors.flame.DEFAULT,
      },
    }}
  >
    <SafeAreaProvider>
      <AuthProvider>
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
      </AuthProvider>
    </SafeAreaProvider>
  </NavigationContainer>
);

export default registerRootComponent(App);
