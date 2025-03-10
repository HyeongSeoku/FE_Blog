export const isSafari = (userAgent?: string) => {
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /^((?!chrome|android).)*safari/i.test(ua);
};
