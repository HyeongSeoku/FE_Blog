import { GithubUser } from "@/types/github";
import { create } from "zustand";

export interface GithubInfoState {
  githubUser: GithubUser;
  setGithubUser: (info: GithubUser) => void;
}

const initialGithubInfo = {
  imgSrc: "",
  githubUrl: "",
  githubName: "",
};

const useGithubInfoStore = create<GithubInfoState>((set) => {
  return {
    githubUser: initialGithubInfo,
    setGithubUser: (info: GithubUser) => {
      set({ githubUser: info });
    },
  };
});

export default useGithubInfoStore;
