import { create } from "zustand";
import { MOBILE_WIDTH } from "@/constants/basic.constants";

interface DeviceTypeState {
  isMobileSize: boolean;
  setIsMobile: (state: boolean) => void;
}

const getInitialDeviceType = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= MOBILE_WIDTH;
  }
  return false;
};

const useDeviceStore = create<DeviceTypeState>((set) => {
  return {
    isMobileSize: getInitialDeviceType(),
    setIsMobile: (isMobileSize) => set({ isMobileSize: isMobileSize }),
  };
});

export default useDeviceStore;
