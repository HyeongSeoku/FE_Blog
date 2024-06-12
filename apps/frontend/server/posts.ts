import { FetchOptions, fetchData } from "./utils";

export const postCreatePost = async (options?: FetchOptions) => {
  const postData = await fetchData("/posts/create", options);
  return postData;
};
