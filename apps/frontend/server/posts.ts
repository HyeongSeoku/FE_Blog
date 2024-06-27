import { FetchDataResponse } from "~/types/api";
import {
  BasicInfoResponse,
  CreatePostRequest,
  CreatePostResponse,
} from "../../../types/posts/posts.api";
import { FetchOptions, fetchData } from "./utils";

export const getBasicInfoPost = async (
  req?: Request,
  options?: FetchOptions,
): Promise<FetchDataResponse<BasicInfoResponse>> => {
  const basicInfo = await fetchData("/posts/basic-info", options, req);
  return basicInfo;
};

export const postCreatePost = async (
  postObj: CreatePostRequest,
  options?: FetchOptions,
): Promise<FetchDataResponse<CreatePostResponse>> => {
  const postData = await fetchData("/posts/create", {
    ...options,
    method: "POST",
    body: postObj,
  });
  return postData;
};
