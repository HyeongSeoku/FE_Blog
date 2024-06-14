import { FetchDataResponse } from "~/types/api";
import { FetchOptions, fetchData } from "./utils";
import { UserProps } from "store/user";

interface GetUserProfileResponse extends FetchDataResponse {
  data: UserProps | null;
}

export const getUserProfile = async (
  req?: Request,
  options?: FetchOptions,
): Promise<GetUserProfileResponse> => {
  const userProfile = await fetchData("/auth/me", options, req);
  return userProfile;
};

export const getGithubAuthUrl = async () => {
  const result = await fetchData("/auth/github/login");
  return result;
};
