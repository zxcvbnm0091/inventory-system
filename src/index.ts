import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

let server: ReturnType<typeof app.listen>;

async function main() {
  await prisma.$connect();
  console.log("🟢 Database connected");

  server = app.listen(PORT, () => {
    console.log(`🟢 Server is running on port: ${PORT}`);
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
  await prisma.$disconnect();
  process.exit(1);
});

process.on("unhandledRejection", async (err) => {
  console.error("💥 Unhandled Rejection:", err);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
