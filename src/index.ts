import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config/config";
import logger from "./config/logger";
const PORT = config.port;

let server: ReturnType<typeof app.listen>;

async function main() {
  await prisma.$connect();
  console.log("🟢 Database connected");

  server = app.listen(PORT, () => {
    console.log(`🟢 Server is running on port: ${PORT}`);
    logger.info(`Listening to port ${config.port}`);
  });
}

async function gracefulShutdown(signal: string) {
  console.log(`⚠️ ${signal} received, shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log("🛑 Process terminated!");
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main().catch(async (err) => {
  console.error("🔴 Failed to start server:", err);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("uncaughtException", async (err) => {
  console.error("💥 Uncaught Exception:", err);
  forcefulShutdown();
});

process.on("unhandledRejection", async (err) => {
  console.error("💥 Unhandled Rejection:", err);
  forcefulShutdown();
});

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});
process.on("SIGINT", () => {
  logger.info("SIGTERM received");
  gracefulShutdown("SIGINT");
});

let isShuttingDown = false;

function forcefulShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  const killTimer = setTimeout(() => {
    console.error("🛑 Forced exit after timeout");
    process.exit(1);
  }, 5000);

  killTimer.unref();

  gracefulShutdown("CRASH").catch(() => {
    process.exit(1);
  });
}
