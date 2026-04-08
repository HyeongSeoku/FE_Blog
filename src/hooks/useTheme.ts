import { useEffect } from "react";
import useThemeStore from "@/store/theme";

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
