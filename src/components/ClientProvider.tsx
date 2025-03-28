"use client";

import useDetectResize from "@/hooks/useDetectResize";
import useTheme from "@/hooks/useTheme";
import { ReactNode } from "react";

export interface ClientProviderProps {
  children: ReactNode;
}

function ClientProvider({ children }: ClientProviderProps) {
  useDetectResize();
  useTheme();

  return <>{children}</>;
}
export default ClientProvider;
