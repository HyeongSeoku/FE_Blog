import { useEffect } from "react";

const useMount = (callback: () => void) => {
  useEffect(() => {
    if (callback && typeof callback === "function") {
      callback();
    }
  }, [callback]);
};

export default useMount;
