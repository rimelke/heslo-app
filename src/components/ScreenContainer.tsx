import { SafeAreaView } from "react-native-safe-area-context";
import { PropsWithChildren } from "react";

const ScreenContainer = ({ children }: PropsWithChildren<{}>) => (
  <SafeAreaView
    style={{
      padding: 24,
      flex: 1,
    }}
  >
    {children}
  </SafeAreaView>
);

export default ScreenContainer;
