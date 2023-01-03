import api from "@services/api";
import { useState } from "react";

type Methods = "post" | "put" | "patch" | "delete";

interface Options {
  stopLoadingOnSuccess?: boolean;
  defaultIsLoading?: boolean;
}

interface SendRequestOptions {
  transformData?: (rawData: any) => Promise<any>;
}

const useRequest = <T = any>(
  path: string,
  method: Methods = "post",
  { stopLoadingOnSuccess = true, defaultIsLoading = false }: Options = {}
) => {
  const [isLoading, setIsLoading] = useState(defaultIsLoading);
  const [error, setError] = useState<string>();

  const sendRequest = async (
    rawData?: unknown,
    { transformData }: SendRequestOptions = {}
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      setError(undefined);

      const data = transformData ? await transformData(rawData) : rawData;
      const { data: result } = await api[method]<T>(path, data);

      if (stopLoadingOnSuccess) setIsLoading(false);

      return (result || true) as T;
    } catch (err: any) {
      setIsLoading(false);

      if (err?.response?.data?.message) setError(err.response.data.message);
      else console.error(err);
    }
  };

  return {
    isLoading,
    sendRequest,
    error,
  };
};

export default useRequest;
