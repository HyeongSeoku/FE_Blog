import useThemaStore from "@/store/thema";
import { useEffect } from "react";

const useTheme = () => {
  const { isDarkMode } = useThemaStore();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);
};

export default useTheme;
