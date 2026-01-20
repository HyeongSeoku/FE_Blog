export function formatTagDisplay(tag: string): string {
  return tag.trim().replace(/\s+/g, "-");
}

export function normalizeTagForUrl(tag: string): string {
  return formatTagDisplay(tag).toLowerCase().replace(/-+/g, "-");
}

export function getTagPath(tag: string): string {
  const normalizedTag = normalizeTagForUrl(tag);
  return `/blog/tags/${normalizedTag}`;
}
