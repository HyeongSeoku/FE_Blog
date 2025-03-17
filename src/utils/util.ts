export const isSafari = (userAgent?: string) => {
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /^((?!chrome|android).)*safari/i.test(ua);
};

export const issueUrl = (title: string, body: string) => {
  return `title=${encodeURIComponent(
    `${title}`,
  )}&body=${encodeURIComponent(`${body}`)}`;
};
