import { fetchData } from "./utils";

export const getUserProfile = async (accessToken: string, req?: Request) => {
  const userProfile = await fetchData(
    "/auth/me",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    req,
  );

  return userProfile;
};

export const getGithubAuthUrl = async () => {
  const result = await fetchData("/auth/github/login");
  return result;
};
