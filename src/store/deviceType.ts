import { MOBILE_WIDTH } from "@/constants/device.constants";
import { create } from "zustand";

interface DeviceTypeState {
  isMobile: boolean;
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
    isMobile: getInitialDeviceType(),
    setIsMobile: (isMobile) => set({ isMobile: isMobile }),
  };
});

export default useDeviceStore;
