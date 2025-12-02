// lib/prisma.ts

// 1. Import necessary Prisma types, the Driver Adapter, and the specific database driver
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg' // <-- Change this adapter for your database
import pg from 'pg'                        // <-- Change this driver for your database
import 'dotenv/config'

// 2. Define the global object extension for TypeScript
declare global {
  // Use 'globalThis' for broader compatibility (Node.js/Workers/etc.)
  var prisma: PrismaClient | undefined 
}

// 3. Define the function to create the new client instance
const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  
  // Create the database driver instance (e.g., a pool)
  const pool = new pg.Pool({ connectionString })
  
  // Create the Prisma Driver Adapter instance
  const adapter = new PrismaPg(pool)

  // Instantiate PrismaClient with the adapter
  return new PrismaClient({
    adapter,
    // Add any global logging configuration here
    // log: ['query', 'info', 'warn', 'error'],
  })
}

// 4. Implement the singleton pattern using globalThis
// This ensures that in a long-running process, only one instance is ever created.
export const prisma = globalThis.prisma || createPrismaClient()

// 5. Assign to globalThis ONLY in development
// This prevents hot-reloading from creating new instances in dev mode.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Export the single instance
export default prisma