"use client";

import useTheme from "@/hooks/useTheme";
import { useDeviceDetect } from "@/store/deviceType";
import { ReactNode } from "react";

function ClientProvider({ children }: { children: ReactNode }) {
  useDeviceDetect();
  useTheme();

  return <>{children}</>;
}
export default ClientProvider;
