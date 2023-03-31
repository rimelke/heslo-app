import api from "@services/api";
import { useEffect, useState } from "react";

const useGet = <T = any>(
  path: string,
  dependencies: any[] = [],
  params?: any
) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dependencies.some((dependency) => !dependency)) return;

    const getData = async () => {
      try {
        setIsLoading(true);
        setData(undefined);

        const { data: newData } = await api.get<T>(path, { params });

        setData(newData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [path, ...dependencies]);

  return { data, isLoading, setData };
};

export default useGet;
