import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: () => void;
  setLightMode: () => void;
}

const getInitialTheme = (): boolean => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false; // 기본값: 라이트 모드
};

// zustand 스토어 생성
const useThemaStore = create<ThemeState>((set) => ({
  isDarkMode: getInitialTheme(),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: () => set({ isDarkMode: true }),
  setLightMode: () => set({ isDarkMode: false }),
}));

export default useThemaStore;
