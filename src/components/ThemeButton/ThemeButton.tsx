"use client";

import useThemeStore from "@/store/theme";
import SunIcon from "@/icon/sun.svg";
import MoonIcon from "@/icon/moon.svg";
import styles from "./themeButton.module.css";
import classNames from "classnames";

const cx = (...args: string[]) =>
  classNames(...args.map((arg) => styles[arg] || arg));

const ThemeButton = () => {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // const ariaLabel = isClient
  //   ? `change ${isDarkMode ? "Light" : "Dark"} mode`
  //   : "change theme";

  const ariaLabel = `change ${isDarkMode ? "Light" : "Dark"} mode`;

  return (
    <button
      className="flex flex-col flex-shrink-0 w-10 h-10 overflow-hidden hover:bg-gray-400/20 rounded-sm"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={toggleTheme}
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
