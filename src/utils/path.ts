export const getTagPath = (tag: string) => {
  const lowerCaseTag = tag.toLowerCase();
  return `/blog/tags/${lowerCaseTag}`;
};
