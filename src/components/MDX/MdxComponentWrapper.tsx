"use client";

import { ReactNode } from "react";

function MdxComponentWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full px-5 py-3 bg-opacity-15 rounded-md">
      {children}
    </div>
  );
}

export default MdxComponentWrapper;
