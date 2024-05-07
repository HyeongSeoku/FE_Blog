import axios from "axios";
// import axiosClient from "./utils";

export const githubLogin = async (state: string) => {
  // FIXME: https://github.com/login/oauth/authorize?client_id=
  // return await axiosClient.get("/auth/github/login");
  return await axios.get(
    `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${import.meta.env.VITE_API_BASE_URL}/auth/github/callback`)}&scope=user:email&state=${state}`
  );
};
