import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useMatches,
} from "@remix-run/react";
import { ACCESS_TOKEN_KEY } from "constants/cookie.constants";
import { parse } from "cookie";
import { useEffect } from "react";
import { getUserProfile } from "server/user";
import useUserStore from "store/user";
import NotFound from "./routes/404";
import DefaultLayout from "./layout/defaultLayout";
import { Handle } from "./types/handle";
import { Error } from "./types/error";

interface RootLoaderData {
  isLoginPage: boolean;
  userData?: any;
  hasLoginError?: boolean;
  loginError?: Error;
  metaTitle?: string;
}

const isLoginRequired = (pathname: string) => {
  const protectRoutes = ["/write", "/setting", "/login/success"];
  return protectRoutes.some((route) => pathname.startsWith(route));
};

export const links = () => [
  { rel: "stylesheet", href: "/styles/tailwind.css" },
];

export const meta: MetaFunction = ({ data }) => {
  const { metaTitle } = (data as RootLoaderData) || {};
  return [
    { charset: "utf-8" },
    { title: metaTitle || "Remix App" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (isLoginRequired(pathname)) {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parse(cookieHeader || "");

    const accessToken = cookies[ACCESS_TOKEN_KEY];

    const { data: userData, error } = await getUserProfile(
      accessToken,
      request,
    );

    const hasLoginError = !userData || !!error;
    const loginError = error;

    return {
      isLoginPage: true,
      userData,
      hasLoginError,
      loginError,
      metaTitle: "Login Required",
    };
  }

  return {
    isLoginPage: false,
    hasLoginError: false,
    userData: null,
    loginError: null,
    metaTitle: "Remix TEST",
  };
};

export function Document({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1] as
    | { handle: Handle }
    | undefined;
  const metaTitle = lastMatch?.handle?.metaTitle || "Remix App";

  return (
    <html lang="ko-kr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>{metaTitle}</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <DefaultLayout>
        <NotFound />
      </DefaultLayout>
    </Document>
  );
}

export default function App() {
  const { hasLoginError, userData, loginError } =
    useLoaderData<RootLoaderData>() || {};
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1] as { handle: Handle };
  const Layout = lastMatch?.handle?.Layout || DefaultLayout;

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }

    if (hasLoginError) {
      alert(`로그인이 필요합니다. 에러 사유 : ${loginError?.message}`);
      console.warn(loginError?.message);
      navigate("/");
    }
  }, [userData, hasLoginError, navigate, setUser]);

  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}
