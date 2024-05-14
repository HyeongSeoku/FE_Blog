import { create } from "zustand";

interface UserProps {
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

const initUser: UserProps = {
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

const useUserStore = create((set) => ({
  ...initUser,
  setUser: (userData: UserProps) => set(userData),
}));

export default useUserStore;
