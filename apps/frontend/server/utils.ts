interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ErrorProps {
  statusCode: number;
  timeStamp?: string;
  path?: string;
  message?: string;
}

const isServer = typeof window === "undefined";

const API_BASE_URL = isServer
  ? import.meta.env.VITE_SERVER_API_BASE_URL
  : import.meta.env.VITE_CLIENT_API_BASE_URL;

/**
 * 범용 API 호출 함수
 * @param path API 경로
 * @param options 추가 fetch 설정
 */
export async function fetchData(
  path: string,
  options: FetchOptions = {},
  request?: Request,
): Promise<{ data?: any; error: ErrorProps | null }> {
  const url = `${API_BASE_URL}${path}`;
  const serverCookies = request?.headers?.get("Cookie");

  const defaultOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: serverCookies || "",
    },
    credentials: "include",
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  try {
    const response = await fetch(url, finalOptions);
    const responseData = await response.json();

    if (!response.ok) {
      return { data: null, error: responseData as ErrorProps };
    }

    return { data: responseData, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error: null };
  }
}
