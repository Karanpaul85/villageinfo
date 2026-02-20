export const REVALIDATE_TIME = 3600; // 1 hour in seconds
export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://villageinfo.vercel.app";
