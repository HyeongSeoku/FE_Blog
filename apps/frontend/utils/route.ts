export const isLoginRequired = (pathname: string) => {
  const protectRoutes = ["/write", "/setting", "/login/success"];
  return protectRoutes.some((route) => pathname.startsWith(route));
};

export const isRootRoute = (pathname: string) => {
  const rootRoute = "/";
  return pathname.startsWith(rootRoute);
};
