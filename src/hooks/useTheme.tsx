import useThemeStore from "@/store/theme";
import { useEffect } from "react";

const useTheme = (initialTheme?: string) => {
  const { isDarkMode, setDarkMode, setLightMode } = useThemeStore();

  useEffect(() => {
    if (initialTheme) {
      if (initialTheme === "dark") {
        setDarkMode();
      } else {
        setLightMode();
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);
};

export default useTheme;
