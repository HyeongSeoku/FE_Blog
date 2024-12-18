"use client";

import useScrollProgress from "@/hooks/useScrollProgress";

const ScrollProgressBar = () => {
  const progressWidth = useScrollProgress();

  return (
    <div className="absolute left-0 right-0 bottom-0 w-full h-1 bg-gray-300 z-10 rounded-sm md:hidden">
      <div
        className="h-full bg-blue-500 transition-width duration-100 ease-out rounded-sm"
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
