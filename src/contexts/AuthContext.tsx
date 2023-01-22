import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
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
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  password: string | undefined;
  setPassword: (password: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  defaultEmail: string | undefined;
  setDefaultEmail: (email: string) => void;
}

export const AuthContext = createContext({} as IAuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [token, setTokenState] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const { data: user, setData: setUser } = useGet<IUser>("/users", [token]);
  const [defaultEmail, setDefaultEmail] = useState<string | undefined>();
  const [isAppReady, setIsAppReady] = useState(false);

  const logout = async () => {
    setTokenState(undefined);
    setPassword(undefined);
    await asyncStorage.removeItem(TOKEN_KEY);
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

  const handleSetDefaultEmail = async (email: string) => {
    await asyncStorage.setItem(DEFAULT_EMAIL_KEY, email);
    setDefaultEmail(email);
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
        setUser,
        password,
        setPassword,
        defaultEmail,
        setDefaultEmail: handleSetDefaultEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
