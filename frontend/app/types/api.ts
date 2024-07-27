export interface FetchDataResponse<T = any> {
  data: T | null;
  error: FetchErrorProps | null;
  setCookieHeaders: string[] | null;
}

export interface FetchErrorProps {
  statusCode: number;
  timeStamp?: string;
  path?: string;
  message?: string;
}
