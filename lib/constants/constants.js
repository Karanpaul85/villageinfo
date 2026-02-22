export const REVALIDATE_TIME = 10; // 1 hour in seconds
export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://villageinfo.vercel.app";
export const SITE_MAP_PER_PAGE = 10000;
