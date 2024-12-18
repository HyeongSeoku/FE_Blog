"use client";

import useScrollProgress from "@/hooks/useScrollProgress";
import ArrowTop from "@/icon/arrow_top.svg";
import classNames from "classnames";
import { useEffect, useState } from "react";

const MoScrollProgress = () => {
  const progressWidth = useScrollProgress();

  const [isScrollTop, setIsScrollTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollTop(window.scrollY === 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={classNames(
        "group min-md:hidden flex justify-center items-center w-7 h-7 relative transition-opacity duration-300 opacity-0 ",
        {
          invisible: isScrollTop,
          "opacity-100 ": !isScrollTop,
        },
      )}
      onClick={scrollToTop}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-gray-300"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          className="text-blue-500"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          cx="50"
          cy="50"
          r="45"
          style={{
            strokeDasharray: 2 * Math.PI * 45,
            strokeDashoffset:
              2 * Math.PI * 45 - (progressWidth / 100) * 2 * Math.PI * 45,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <div className="absolute group-hover:animate-bounceSlight">
        <ArrowTop width={18} />
      </div>
    </button>
  );
};

export default MoScrollProgress;
