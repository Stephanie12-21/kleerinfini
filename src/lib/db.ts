import { PrismaClient } from "@prisma/client";

const prisma =
  (globalThis as { prisma?: PrismaClient }).prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  (globalThis as { prisma?: PrismaClient }).prisma = prisma;
}
export const db = prisma;
