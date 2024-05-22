import { create } from "zustand";

export interface UserProps {
  userId: string;
  username: string;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastLogin: Date | null;
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
  user: UserProps;
  setUser: (userData: UserProps) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: initUser,
  setUser: (userData: UserProps) => set({ user: userData }),
}));

export default useUserStore;
