import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";
import { getCookie, setCookie } from "@/utils/cookies";
import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: () => void;
  setLightMode: () => void;
}

const getInitialTheme = (): boolean => {
  if (typeof window !== "undefined") {
    const cookieTheme = getCookie(LIGHT_DARK_THEME);

    return (
      cookieTheme === "dark" ??
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
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
