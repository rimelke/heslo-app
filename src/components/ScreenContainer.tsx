import { SafeAreaView } from "react-native-safe-area-context";
import { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";

interface ScreenContainerProps {
  withScroll?: boolean;
}

const ScreenContainer = ({
  children,
  withScroll,
}: PropsWithChildren<ScreenContainerProps>) => (
  <SafeAreaView
    style={{
      padding: 24,
      paddingBottom: 32,
      flex: 1,
    }}
  >
    {withScroll ? (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {children}
      </ScrollView>
    ) : (
      children
    )}
  </SafeAreaView>
);

export default ScreenContainer;
