import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { ACCESS_TOKEN_KEY } from "constants/cookie.constants";
import { parse } from "cookie";
import { useEffect } from "react";
import { getUserProfile } from "server/user";
import useUserStore, { UserProps } from "store/user";
import NotFound from "./routes/404";

interface RootLoaderData {
  isLoginPage: boolean;
  userData?: any;
  hasLoginError?: boolean;
  loginError?: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
  hasLoginError?: boolean;
  userData?: UserProps;
  loginError?: any;
}

const isLoginRequired = (pathname: string) => {
  const protectRoutes = ["/write", "/setting", "/login/success"];
  return protectRoutes.some((route) => pathname.startsWith(route));
};

export const links = () => [
  { rel: "stylesheet", href: "/styles/tailwind.css" },
];

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "Remix App" },
    { viewport: "width=device-width, initial-scale=1" },
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

    return { isLoginPage: true, userData, hasLoginError, loginError };
  }

  return {
    isLoginPage: false,
    hasLoginError: false,
    userData: null,
    loginError: null,
  };
};

export function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {title ? <title>{title}</title> : null}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const Layout = ({ children, userData, hasLoginError }: LayoutProps) => {
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }

    if (hasLoginError) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [userData, hasLoginError, navigate, setUser]);

  return <>{children}</>;
};

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Document title="Error">
      <Layout>
        <NotFound />
      </Layout>
    </Document>
  );
}

export default function App() {
  const { hasLoginError, userData, loginError } =
    useLoaderData<RootLoaderData>() || {};

  return (
    <Document>
      <Layout
        hasLoginError={hasLoginError}
        userData={userData}
        loginError={loginError}
      >
        <Outlet />
      </Layout>
    </Document>
  );
}
