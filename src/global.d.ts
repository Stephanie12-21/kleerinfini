// src/global.d.ts ou global.d.ts
import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;
}

export {};
