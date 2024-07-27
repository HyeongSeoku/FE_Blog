import { create } from "zustand";
import { UserProps } from "~/types/user";

export const initUser: UserProps = {
  userId: "",
  username: "",
  email: "",
  createdAt: null,
  updatedAt: null,
  lastLogin: null,
  isAdmin: false,
  githubId: "",
  githubImgUrl: "",
  githubProfileUrl: "",
  followers: [],
  following: [],
};

interface UserState {
  userStore: UserProps;
  setUserStore: (userData: UserProps) => void;
  initializeUserStore: () => void;
}

const useUserStore = create<UserState>((set) => ({
  userStore: initUser,
  setUserStore: (userData: UserProps) => set({ userStore: userData }),
  initializeUserStore: () => set({ userStore: initUser }),
}));

export default useUserStore;
