import { FetchDataResponse } from "~/types/api";
import {
  BasicInfoResponse,
  CreatePostRequest,
  CreatePostResponse,
  GetPostListRequest,
  GetPostListResponse,
} from "../../types/posts/posts.api";
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

export const getPostList = async (
  postListParam: GetPostListRequest,
  req?: Request,
  options?: FetchOptions,
): Promise<FetchDataResponse<GetPostListResponse>> => {
  const { categoryId, pageNumber = 1 } = postListParam;

  const postListData = await fetchData("/posts/list", { ...options }, req);
  return postListData;
};
