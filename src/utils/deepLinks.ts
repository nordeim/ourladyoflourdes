export const knownRoutePaths = [
  "/",
  "/about",
  "/history",
  "/worship",
  "/sacraments",
  "/ministries",
  "/news-events",
  "/give",
  "/faq",
  // legacy ourladyoflourdes.sg paths preserved as aliases
  "/history-of-the-church",
  "/mass-times",
  "/contact-us",
  "/all-sacraments",
  "/all-ministries",
  "/parish-bulletin",
  "/church-events",
  "/news-and-events",
  "/donate",
] as const;

export function resolveHashRedirect(
  pathname: string,
  hash: string
): string | null {
  const path = pathname.replace(/\/$/, "");
  if (path === "" || path === "/") return null;
  if (!knownRoutePaths.includes(path as (typeof knownRoutePaths)[number])) {
    return null;
  }
  return "/#" + path + hash;
}
