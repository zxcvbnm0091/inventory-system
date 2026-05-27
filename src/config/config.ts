import "dotenv/config";

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5001,
  database: {
    url: process.env.DATABASE_URL as string,
  },
  jwt: {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: "10m",
    refreshExpiresIn: "7d",
    accessExpiresMs: 10 * 60 * 1000,
    refreshExpiresMs: 7 * 24 * 60 * 60 * 1000,
  },
} as const;

export default config;
