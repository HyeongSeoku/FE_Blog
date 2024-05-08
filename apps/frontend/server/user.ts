import axiosClient from "./utils";

export const getUserProfile = async (accessToken: string) => {
  const { data } = await axiosClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log("TEST GET USER PROFILE", data);
  return data;
};
