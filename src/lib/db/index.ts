import { mockDb, type MockDB } from './mock-repo'
import { prismaDb } from './prisma-repo'

// =====================================================================
// Selector de driver de datos.
//   DATA_DRIVER=prisma  → PostgreSQL (persistente)
//   DATA_DRIVER=mock    → store en memoria (demo, por defecto)
// Ambos módulos se importan, pero el cliente Prisma solo se instancia al
// primer query (getPrisma()), así que el modo mock no necesita DATABASE_URL.
// =====================================================================

export const db: MockDB = process.env.DATA_DRIVER === 'prisma' ? prismaDb : mockDb
export type DB = MockDB
