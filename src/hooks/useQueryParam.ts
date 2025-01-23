import { useSearchParams } from "next/navigation";

export const useQueryParam = (key: string) => {
  const params = useSearchParams();
  const value = params.get(key);

  return value;
};
