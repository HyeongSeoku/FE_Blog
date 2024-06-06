import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import NotFound from "./routes/404";
import DefaultLayout from "./layout/defaultLayout";
import { Handle } from "./types/handle";
import styles from "./styles/tailwind.css?url";
import { loaderCheckUser } from "utils/auth";
import useUserStore, { UserProps } from "store/user";
import { useEffect } from "react";
import { getUserProfile } from "server/user";
import { deepEqual } from "utils/object";
import { isLoginRequired } from "utils/route";

interface RootLoaderData {
  isLoginPage: boolean;
  metaTitle?: string;
  user?: UserProps;
  setCookieHeaders: string[] | null;
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

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

  const { user, headers } = await loaderCheckUser(request);

  return json(
    {
      isLoginPage: true,
      metaTitle: isLoginRequired(pathname) ? "Login Required" : "Remix TEST",
      user,
    },
    { headers },
  );
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
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // Handle known errors
    if (error.status === 404) {
      return (
        <Document>
          <DefaultLayout>
            <NotFound />
          </DefaultLayout>
        </Document>
      );
    }
  }
}

export default function App() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1] as { handle: Handle };
  const headerType = lastMatch?.handle?.headerType || "DEFAULT";

  const Layout = lastMatch?.handle?.Layout || DefaultLayout;

  const { user } = useLoaderData<RootLoaderData>();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setUserStore, userStore } = useUserStore();

  const checkUser = async () => {
    const { data: userData, error } = await getUserProfile();
    if (userData && !deepEqual(userStore, userData)) {
      setUserStore(userData);
    }

    if (error || !userData) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (user) {
      setUserStore(user);
    }
  }, [user, setUserStore]);

  useEffect(() => {
    if (isLoginRequired(pathname)) {
      checkUser();
    }
  }, [pathname]);

  return (
    <Document>
      <Layout headerType={headerType}>
        <Outlet />
      </Layout>
    </Document>
  );
}
