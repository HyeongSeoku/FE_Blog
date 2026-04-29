import { create } from "zustand";
import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";
import { getCookie, setCookie } from "@/utils/cookies";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: () => void;
  setLightMode: () => void;
}

const getInitialIsDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const cookieTheme = getCookie(LIGHT_DARK_THEME);
  if (cookieTheme === "dark") return true;
  if (cookieTheme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: getInitialIsDarkMode(),
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
}));

export default useThemeStore;
