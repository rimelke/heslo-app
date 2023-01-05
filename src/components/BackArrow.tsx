import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { ArrowSmallLeftIcon } from "react-native-heroicons/solid";
import theme from "src/theme";

const BackArrow = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => navigation.goBack()}
    >
      <ArrowSmallLeftIcon size={24} color={theme.colors.olive.DEFAULT} />
    </TouchableOpacity>
  );
};

export default BackArrow;
