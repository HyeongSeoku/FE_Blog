import { fetchData } from "./utils";

export const getUserProfile = async (accessToken: string) => {
  try {
    const userProfile = await fetchData("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // console.log("User Profile:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Failed to load user profile:", error);
  }
};
