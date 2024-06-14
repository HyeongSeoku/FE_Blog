import { FetchOptions, fetchData } from "./utils";

export const postCreatePost = async (options?: FetchOptions) => {
  const postData = await fetchData("/posts/create", options);
  return postData;
};

export const getBasicInfoPost = async (
  req?: Request,
  options?: FetchOptions,
) => {
  const basicInfo = await fetchData("/posts/basic-info", options, req);
  return basicInfo;
};
