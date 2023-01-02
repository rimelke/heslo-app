import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabList } from "../App";
import { DEFAULT_EMAIL_KEY, TOKEN_KEY } from "../constants/keys";
import api from "../services/api";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Signup from "../screens/Signup";

interface IUser {
  id: string;
  name: string;
  slogan: string;
  imageUrl: string;
  plan: "free" | "premium";
  createdAt: Date;
  email: string;
}

interface IAuthContextData {
  isAuthenticated: boolean;
  token: string | undefined;
  user?: IUser;
  password: string | undefined;
  setPassword: (password: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as IAuthContextData);

export type AuthStackList = {
  Login: { defaultEmail?: string };
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackList>();

const Wrapper = ({
  children,
  isAuthenticated,
  defaultEmail,
}: PropsWithChildren<{
  isAuthenticated: boolean;
  defaultEmail?: string;
}>) => {
  if (isAuthenticated) return <>{children}</>;

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
};

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [token, setTokenState] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [user, setUser] = useState<IUser>();
  const [defaultEmail, setDefaultEmail] = useState<string | undefined>();
  const [isAppReady, setIsAppReady] = useState(false);
  const navigation = useNavigation<BottomTabNavigationProp<TabList>>();

  const logout = async () => {
    await asyncStorage.removeItem(TOKEN_KEY);
    setTokenState(undefined);
    setPassword(undefined);
    navigation.navigate("Home");
  };

  useEffect(() => {
    const getToken = async () => {
      const [savedToken, savedDefaultEmail] = await Promise.all([
        asyncStorage.getItem(TOKEN_KEY),
        asyncStorage.getItem(DEFAULT_EMAIL_KEY),
      ]);

      if (savedToken) setTokenState(savedToken);
      if (savedDefaultEmail) setDefaultEmail(savedDefaultEmail);

      setIsAppReady(true);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (!isAppReady) return;

    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplashScreen();
  }, [isAppReady]);

  useEffect(() => {
    if (!token) return;

    const getUser = async () => {
      const { data } = await api.get("/users");

      setUser(data);
    };

    getUser();

    const timeout = setTimeout(logout, 1000 * 60 * 59);

    return () => clearTimeout(timeout);
  }, [token]);

  const setToken = async (token: string) => {
    await asyncStorage.setItem(TOKEN_KEY, token);
    setTokenState(token);
  };

  const isAuthenticated = !!token && !!password;

  if (!isAppReady) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!password,
        token,
        setToken,
        logout,
        user,
        password,
        setPassword,
      }}
    >
      <Wrapper defaultEmail={defaultEmail} isAuthenticated={isAuthenticated}>
        {children}
      </Wrapper>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
