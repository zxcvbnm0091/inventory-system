import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import config from "../config/config";

const connectionString = config.database.url;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
