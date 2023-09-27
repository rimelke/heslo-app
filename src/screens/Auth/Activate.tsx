import Loading from "@components/Loading";
import ScreenContainer from "@components/ScreenContainer";
import ErrorScreen from "@components/screens/ErrorScreen";
import useRequest from "@hooks/useRequest";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { AuthStackList } from "src/Router";

const Activate = ({
  route,
  navigation,
}: NativeStackScreenProps<AuthStackList, "Activate">) => {
  const { error, sendRequest } = useRequest("/users/activate", "patch", {
    stopLoadingOnSuccess: false,
    defaultIsLoading: true,
  });

  const token = route.params?.token;

  useEffect(() => {
    if (!token) return;

    const handleActivate = async () => {
      const result = await sendRequest({ token });

      if (!result) return;

      navigation.replace("Plan");
    };

    handleActivate();
  }, [token]);

  if (error) return <ErrorScreen error={error} />;

  return (
    <ScreenContainer>
      <Loading />
    </ScreenContainer>
  );
};

export default Activate;
