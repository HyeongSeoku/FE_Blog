export interface FetchDataResponse<T = unknown> {
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
