import app from './app';
import { env } from './v1/config/env';
import prisma from './prisma';

const PORT = Number(env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 TenderVault API running at http://localhost:${PORT}`);
});

// Graceful shutdown — disconnect Prisma only here, never per-request
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
