interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const isServer = typeof window === "undefined";

// 환경 변수 설정에 따라 baseUrl 결정
const API_BASE_URL = isServer
  ? import.meta.env.VITE_SERVER_API_BASE_URL // 서버 사이드 URL
  : import.meta.env.VITE_CLIENT_API_BASE_URL; // 클라이언트 사이드 URL

/**
 * 범용 API 호출 함수
 * @param path API 경로
 * @param options 추가 fetch 설정
 */
export async function fetchData(path: string, options: FetchOptions = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
