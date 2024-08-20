import useThemeStore from "@/store/theme";
import { useEffect } from "react";

const useTheme = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);
};

export default useTheme;
