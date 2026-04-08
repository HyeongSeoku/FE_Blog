"use client";

import type { ReactNode } from "react";
import useDetectResize from "@/hooks/useDetectResize";
import useTheme from "@/hooks/useTheme";

export interface ClientProviderProps {
  children: ReactNode;
}

function ClientProvider({ children }: ClientProviderProps) {
  useDetectResize();
  useTheme();

  return <>{children}</>;
}
export default ClientProvider;
