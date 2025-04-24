import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";
import { setCookie } from "@/utils/cookies";
import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: () => void;
  setLightMode: () => void;
}

const getInitialTheme = (): boolean => {
  if (typeof document !== "undefined") {
    const htmlTheme = document.documentElement.getAttribute("data-theme");
    if (htmlTheme === "dark") return true;
    if (htmlTheme === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return false;
};

const useThemeStore = create<ThemeState>((set) => {
  return {
    isDarkMode: getInitialTheme(),
    toggleTheme: () =>
      set((state) => {
        const newTheme = !state.isDarkMode;
        setCookie(LIGHT_DARK_THEME, newTheme ? "dark" : "light", 365);
        return { isDarkMode: newTheme };
      }),
    setDarkMode: () => {
      setCookie(LIGHT_DARK_THEME, "dark", 365);
      set({ isDarkMode: true });
    },
    setLightMode: () => {
      setCookie(LIGHT_DARK_THEME, "light", 365);
      set({ isDarkMode: false });
    },
  };
});

export default useThemeStore;
