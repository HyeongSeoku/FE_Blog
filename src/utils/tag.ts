export function formatTagDisplay(tag: string): string {
  return tag.trim().replace(/\s+/g, "-");
}

export function normalizeTagForUrl(tag: string): string {
  return formatTagDisplay(tag)
    .toLowerCase()
    .replace(/\//g, "-") // "CI/CD" 같은 태그가 URL 세그먼트를 쪼개지 않도록
    .replace(/-+/g, "-");
}

export function getTagPath(tag: string): string {
  const normalizedTag = normalizeTagForUrl(tag);
  return `/categories/${normalizedTag}`;
}
