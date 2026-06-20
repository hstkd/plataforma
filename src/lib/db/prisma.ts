import { PrismaClient } from '@prisma/client'

// Singleton perezoso del cliente Prisma. Se construye solo la primera vez
// que se usa (driver prisma); en modo mock nunca se instancia, así que el
// desarrollo local funciona sin DATABASE_URL.

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient }

let client: PrismaClient | undefined

export function getPrisma(): PrismaClient {
  if (!client) {
    client = globalForPrisma.__prisma ?? new PrismaClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = client
  }
  return client
}
