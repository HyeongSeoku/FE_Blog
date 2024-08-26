export const isMobileDevice = (userAgent: string) => {
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
};
