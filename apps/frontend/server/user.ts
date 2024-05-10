import { fetchData } from "./utils";

export const getUserProfile = async (accessToken: string) => {
  const userProfile = await fetchData("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return userProfile;
};
