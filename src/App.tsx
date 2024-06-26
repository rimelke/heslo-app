import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";

SplashScreen.preventAutoHideAsync();

const App = () => (
  <NavigationContainer
    linking={{
      prefixes: [
        "hesloio://",
        "https://app.heslo.io/",
        "https://qa-app.heslo.io/",
        "io.heslo.app://",
      ],
      config: {
        screens: {
          Signup: { path: "signup" },
          Login: { path: "login" },
          Activate: { path: "signup/activate" },
        },
      },
    }}
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
        <Router />
        <StatusBar backgroundColor={theme.colors.floral.DEFAULT} />
      </AuthProvider>
    </SafeAreaProvider>
  </NavigationContainer>
);

export default registerRootComponent(App);
