"use client";

import useDetectResize from "@/hooks/useDetectResize";
import useTheme from "@/hooks/useTheme";
import { ReactNode } from "react";

function ClientProvider({ children }: { children: ReactNode }) {
  useDetectResize();
  useTheme();

  return <>{children}</>;
}
export default ClientProvider;
