import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next, so load .env ourselves (absent in CI).
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
