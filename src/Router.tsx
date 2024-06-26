import { useAuth } from "@contexts/AuthContext";
import { FoldersProvider } from "@contexts/FoldersContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Add from "@screens/Add";
import SecondaryAdd from "@screens/SecondaryAdd";
import FoldersRouter, {
  FoldersRouterRef,
  FoldersStackList,
} from "@screens/FoldersRouter";
import Home from "@screens/Home";
import Login from "@screens/Auth/Login";
import Signup from "@screens/Auth/Signup";
import Success from "@screens/Auth/Success";
import Upgrade from "@screens/Upgrade";
import { View } from "react-native";
import {
  ArrowUpCircleIcon,
  FolderIcon,
  HomeIcon,
  PlusIcon,
  SquaresPlusIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import theme from "./theme";
import Activate from "@screens/Auth/Activate";
import Plan from "@screens/Auth/Plan";
import ProfileRouter, { ProfileStackList } from "@screens/ProfileRouter";
import { useRef } from "react";
import IEntry from "./types/IEntry";
import IGroup from "./types/IGroup";

export type TabList = {
  Home: undefined;
  FoldersRouter: NavigatorScreenParams<FoldersStackList>;
  Add: {
    folderId?: string;
    groupId?: string;
  };
  SecondaryAdd: {
    type?: "folder" | "group";
  };
  ProfileRouter: NavigatorScreenParams<ProfileStackList>;
  Upgrade: undefined;
};

export type AuthStackList = {
  Login: { defaultEmail?: string };
  Signup: undefined;
  Success: undefined;
  Activate: { token?: string };
  Plan: undefined;
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
  const foldersRouterRef = useRef<FoldersRouterRef>(null);

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
        <Stack.Screen name="Activate" component={Activate} />
        <Stack.Screen name="Plan" component={Plan} />
      </Stack.Navigator>
    );

  const addItem = (item: IEntry | IGroup) => {
    foldersRouterRef.current?.addItem(item);
  };

  const updateEntriesPassword = (oldPassword: string, newPassword: string) => {
    foldersRouterRef.current?.updateEntriesPassword(oldPassword, newPassword);
  };

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
            unmountOnBlur: true,
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
        >
          {(props) => <FoldersRouter {...props} ref={foldersRouterRef} />}
        </Tabs.Screen>
        <Tabs.Screen
          options={{
            tabBarIcon: AddButton,
          }}
          name="Add"
        >
          {(props) => <Add {...props} addEntry={addItem} />}
        </Tabs.Screen>
        {user?.plan === "premium" ? (
          <Tabs.Screen
            options={{
              tabBarIcon: ({ color, size }) => (
                <SquaresPlusIcon size={size} color={color} />
              ),
            }}
            name="SecondaryAdd"
          >
            {(props) => <SecondaryAdd {...props} addGroup={addItem} />}
          </Tabs.Screen>
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
          name="ProfileRouter"
        >
          {(props) => (
            <ProfileRouter
              {...props}
              updateEntriesPassword={updateEntriesPassword}
            />
          )}
        </Tabs.Screen>
      </Tabs.Navigator>
    </FoldersProvider>
  );
};

export default Router;
