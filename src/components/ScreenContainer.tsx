import { SafeAreaView } from "react-native-safe-area-context";
import { Fragment, PropsWithChildren } from "react";
import { ScrollView } from "react-native";

interface ScreenContainerProps {
  withScroll?: boolean;
}

const ScreenContainer = ({
  children,
  withScroll,
}: PropsWithChildren<ScreenContainerProps>) => {
  const Container = withScroll ? ScrollView : Fragment;

  return (
    <SafeAreaView
      style={{
        padding: 24,
        flex: 1,
      }}
    >
      <Container>{children}</Container>
    </SafeAreaView>
  );
};

export default ScreenContainer;
