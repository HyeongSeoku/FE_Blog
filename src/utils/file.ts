import fs from "fs/promises";
import path from "path";

export const getMdxFilesRecursively = async (
  dir: string,
): Promise<string[]> => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getMdxFilesRecursively(res);
      } else if (res.endsWith(".mdx")) {
        return res;
      }
      return null;
    }),
  );
  return files.flat().filter(Boolean) as string[];
};
