import axiosClient from "./utils";

export const githubLogin = async () => {
  // FIXME: https://github.com/login/oauth/authorize?client_id=
  return await axiosClient.get("/auth/github/login");
};
