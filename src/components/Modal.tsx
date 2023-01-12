import { PropsWithChildren } from "react";
import {
  Modal as NativeModal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import theme from "src/theme";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
}: PropsWithChildren<ModalProps>) => (
  <NativeModal
    transparent
    visible={isOpen}
    onRequestClose={onClose}
    animationType="fade"
    statusBarTranslucent
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />
    </TouchableWithoutFeedback>

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          marginHorizontal: 24,
          padding: 16,
          borderRadius: 8,
          backgroundColor: theme.colors.floral.DEFAULT,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: theme.colors.olive.dark,
              fontSize: 16,
              fontWeight: "600",
              marginRight: 16,
            }}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <XMarkIcon size={24} color={theme.colors.olive.DEFAULT} />
          </TouchableOpacity>
        </View>

        {children}
      </View>
    </View>
  </NativeModal>
);

export default Modal;
