import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useStorage = <T = any>(key: string) => {
  const [value, setValue] = useState<T>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getValue = async () => {
      const storedValue = await AsyncStorage.getItem(key);

      if (storedValue) setValue(JSON.parse(storedValue));

      setIsReady(true);
    };

    getValue();
  }, [key]);

  return { value, isReady };
};

export default useStorage;
