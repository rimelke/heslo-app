import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { registerRootComponent } from "expo";
import Home from "./screens/Home";

const Tabs = createBottomTabNavigator();

const App = () => (
  <NavigationContainer>
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="Home" component={Home} />
    </Tabs.Navigator>
  </NavigationContainer>
);

export default registerRootComponent(App);
