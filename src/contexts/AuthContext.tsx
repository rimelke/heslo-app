import useGet from "@hooks/useGet";
import asyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_EMAIL_KEY } from "../constants/keys";

interface IUser {
  id: string;
  name: string;
  slogan: string;
  imageUrl: string;
  plan: "free" | "premium";
  createdAt: Date;
  email: string;
  paymentId?: string;
}

interface IAuthContextData {
  isAuthenticated: boolean;
  user?: IUser;
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  password: string | undefined;
  setPassword: (password: string) => void;
  logout: () => void;
  defaultEmail: string | undefined;
  setDefaultEmail: (email: string) => void;
}

export const AuthContext = createContext({} as IAuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [password, setPassword] = useState<string | undefined>();
  const { data: user, setData: setUser } = useGet<IUser>("/users", [password]);
  const [defaultEmail, setDefaultEmail] = useState<string | undefined>();
  const [isAppReady, setIsAppReady] = useState(false);

  const logout = () => {
    setPassword(undefined);
  };

  useEffect(() => {
    const getToken = async () => {
      const savedDefaultEmail = await asyncStorage.getItem(DEFAULT_EMAIL_KEY);

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

  const handleSetDefaultEmail = async (email: string) => {
    await asyncStorage.setItem(DEFAULT_EMAIL_KEY, email);
    setDefaultEmail(email);
  };

  if (!isAppReady) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!password,
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
