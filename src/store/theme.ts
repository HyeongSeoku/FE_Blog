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
    // document.documentElement.setAttribute(
    //   "data-theme",
    //   cookieTheme === "dark" ? "dark" : "light",
    // );

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
        // document.documentElement.setAttribute(
        //   "data-theme",
        //   newTheme ? "dark" : "light",
        // );
        return { isDarkMode: newTheme };
      }),
    setDarkMode: () => {
      setCookie(LIGHT_DARK_THEME, "dark", 365);
      // document.documentElement.setAttribute("data-theme", "dark");
      set({ isDarkMode: true });
    },
    setLightMode: () => {
      setCookie(LIGHT_DARK_THEME, "light", 365);
      // document.documentElement.setAttribute("data-theme", "light");
      set({ isDarkMode: false });
    },
  };
});

export default useThemeStore;
