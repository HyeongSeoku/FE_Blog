import { create } from "zustand";

export interface UserProps {
  userId: string;
  username: string;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastLogin: string | null;
  isAdmin: boolean;
  githubId: string;
  githubImgUrl: string;
  githubProfileUrl: string;
  followers: string[];
  following: string[];
}

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
}

const useUserStore = create<UserState>((set) => ({
  userStore: initUser,
  setUserStore: (userData: UserProps) => set({ userStore: userData }),
}));

export default useUserStore;
