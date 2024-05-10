import { AxiosError } from "axios";

export const BadRequestError = (errorData?: AxiosError) => {
  console.error("잘못된 접근입니다.", errorData);
};

export const UnauthorizedError = (errorData?: AxiosError) => {
  console.error("유효하지 않은 접근입니다.", errorData);
};

export const ForbiddenError = (errorData?: AxiosError) => {
  console.error("권한이 없습니다.", errorData);
};

export const NotFoundError = () => {
  console.error("잘못된 API 경로입니다");
};

export const DefaultError = (errorData?: AxiosError) => {
  console.error("예기치 못한 에러가 발생했습니다.", errorData);
};
