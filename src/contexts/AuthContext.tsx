import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_EMAIL_KEY, TOKEN_KEY } from "../constants/keys";
import * as SplashScreen from "expo-splash-screen";
import useGet from "@hooks/useGet";

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
  defaultEmail: string | undefined;
}

export const AuthContext = createContext({} as IAuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [token, setTokenState] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const { data: user } = useGet<IUser>("/users", [token]);
  const [defaultEmail, setDefaultEmail] = useState<string | undefined>();
  const [isAppReady, setIsAppReady] = useState(false);

  const logout = async () => {
    await asyncStorage.removeItem(TOKEN_KEY);
    setTokenState(undefined);
    setPassword(undefined);
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

    const timeout = setTimeout(logout, 1000 * 60 * 59);

    return () => clearTimeout(timeout);
  }, [token]);

  const setToken = async (token: string) => {
    await asyncStorage.setItem(TOKEN_KEY, token);
    setTokenState(token);
  };

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
        defaultEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
