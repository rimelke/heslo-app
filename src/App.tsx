import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import theme from "./theme";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "./contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Router from "./Router";

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
        <Router />
      </AuthProvider>
    </SafeAreaProvider>
  </NavigationContainer>
);

export default registerRootComponent(App);
