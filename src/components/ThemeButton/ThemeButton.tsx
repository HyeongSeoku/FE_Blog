"use client";

import classNames from "classnames";
import MoonIcon from "@/icon/moon.svg";
import SunIcon from "@/icon/sun.svg";
import useThemeStore from "@/store/theme";
import styles from "./themeButton.module.css";

const cx = (...args: string[]) =>
  classNames(...args.map((arg) => styles[arg] || arg));

const ThemeButton = () => {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <button
      type="button"
      className="flex flex-col flex-shrink-0 w-10 h-10 overflow-hidden hover:bg-gray-400/20 rounded-sm"
      aria-label="테마 변경"
      aria-pressed={isDarkMode}
      title="테마 변경"
      onClick={toggleTheme}
      suppressHydrationWarning
    >
      <div
        className={`${cx("themeContainer")} flex flex-col flex-shrink-0 w-10 h-20 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-center w-10 h-10 hover:animate-rotateFull">
          <SunIcon style={{ width: 24, height: 24 }} />
        </div>
        <div className="flex items-center justify-center w-10 h-10 hover:animate-rotateQuarter">
          <MoonIcon style={{ width: 24, height: 24 }} />
        </div>
      </div>
    </button>
  );
};

export default ThemeButton;
