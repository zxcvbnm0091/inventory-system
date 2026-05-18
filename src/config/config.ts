import "dotenv/config";

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5001,
  database: {
    url: process.env.DATABASE_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
} as const;

export default config;
