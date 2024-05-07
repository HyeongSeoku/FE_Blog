import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  BadRequestError,
  DefaultError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./error";

const createAxios = (requestConfig: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    baseURL: requestConfig.baseURL,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const errorData: AxiosError = error.response?.data;

      switch (status) {
        case 400:
          throw BadRequestError(errorData);
        // TODO: 각 케이스 대응 필요
        case 401:
          throw UnauthorizedError(errorData);
        case 403:
          throw ForbiddenError(errorData);
        case 404:
          throw NotFoundError();
        default:
          DefaultError(errorData);
          return Promise.reject(errorData || error);
      }
    }
  );

  console.log("METAT", import.meta.env.VITE_API_BASE_URL);
  return axiosInstance;
};

// const axiosClient = createAxios({ baseURL: import.meta.env.VITE_API_BASE_URL });
const axiosClient = createAxios({ baseURL: "/api" });

export default axiosClient;
