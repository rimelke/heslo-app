import { AxiosError } from "axios";
import { useState } from "react";

const useAsync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adapt =
    <F extends (...args: any[]) => any>(fn: F) =>
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        return await fn(...args);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.message)
          setError(err.response.data.message);
        else console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

  return {
    isLoading,
    adapt,
    error,
    setError,
  };
};

export default useAsync;
