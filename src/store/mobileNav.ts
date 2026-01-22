import { create } from "zustand";

interface MobileNavState {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const useMobileNavStore = create<MobileNavState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useMobileNavStore;
