import { useEffect } from "react";

const useMount = (callback: () => void) => {
  useEffect(() => {
    if (callback && typeof callback === "function") {
      callback();
    }
  }, []);
};

export default useMount;
