// prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // The database URL for the CLI tools (migrate, generate)
  datasource: {
    url: env('DATABASE_URL'),
  },
  // Optional: Define schema path if it's not in the default location
  // schema: 'prisma/schema.prisma', 
  // Optional: Define seed script location
  // migrations: {
  //   seed: 'tsx prisma/seed.ts',
  // },
})