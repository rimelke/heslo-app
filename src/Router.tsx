import { useAuth } from "@contexts/AuthContext";
import { FoldersProvider } from "@contexts/FoldersContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Add from "@screens/Add";
import AddFolder from "@screens/AddFolder";
import FoldersRouter, { FoldersStackList } from "@screens/FoldersRouter";
import Home from "@screens/Home";
import Login from "@screens/Login";
import Profile from "@screens/Profile";
import Signup from "@screens/Signup";
import Success from "@screens/Success";
import Upgrade from "@screens/Upgrade";
import { View } from "react-native";
import {
  ArrowUpCircleIcon,
  FolderIcon,
  FolderPlusIcon,
  HomeIcon,
  PlusCircleIcon,
  PlusIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import theme from "./theme";

export type TabList = {
  Home: undefined;
  FoldersRouter: NavigatorScreenParams<FoldersStackList>;
  Add: undefined;
  AddFolder: undefined;
  Profile: undefined;
  Upgrade: undefined;
};

export type AuthStackList = {
  Login: { defaultEmail?: string };
  Signup: undefined;
  Success: undefined;
};

const Tabs = createBottomTabNavigator<TabList>();
const Stack = createNativeStackNavigator<AuthStackList>();

const AddButton = () => (
  <View
    style={{
      padding: 14,
      marginBottom: 32,
      borderRadius: 9999,
      backgroundColor: theme.colors.flame.DEFAULT,
      borderWidth: 8,
      borderColor: theme.colors.floral.DEFAULT,
    }}
  >
    <PlusIcon size={28} color={theme.colors.floral.DEFAULT} />
  </View>
);

const Router = () => {
  const { isAuthenticated, defaultEmail, user } = useAuth();

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
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    );

  return (
    <FoldersProvider>
      <Tabs.Navigator
        id="tabs"
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
        <Tabs.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
          name="Home"
          component={Home}
        />
        <Tabs.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <FolderIcon size={size} color={color} />
            ),
          }}
          name="FoldersRouter"
          component={FoldersRouter}
        />
        <Tabs.Screen
          options={{
            tabBarIcon: AddButton,
          }}
          name="Add"
          component={Add}
        />
        {user?.plan === "premium" ? (
          <Tabs.Screen
            options={{
              tabBarIcon: ({ color, size }) => (
                <FolderPlusIcon size={size} color={color} />
              ),
            }}
            name="AddFolder"
            component={AddFolder}
          />
        ) : (
          <Tabs.Screen
            options={{
              tabBarIcon: ({ color, size }) => (
                <ArrowUpCircleIcon size={size} color={color} />
              ),
            }}
            name="Upgrade"
            component={Upgrade}
          />
        )}
        <Tabs.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <UserIcon size={size} color={color} />
            ),
          }}
          name="Profile"
          component={Profile}
        />
      </Tabs.Navigator>
    </FoldersProvider>
  );
};

export default Router;
