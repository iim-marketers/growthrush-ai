import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb(url: string) {
  // Supabase's transaction pooler doesn't support prepared statements.
  return drizzle(postgres(url, { prepare: false }), { schema });
}

// Reuse one pool across dev hot reloads.
const cache = globalThis as unknown as { db?: ReturnType<typeof createDb> };

export function getDb() {
  if (cache.db) return cache.db;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");

  cache.db = createDb(url);
  return cache.db;
}
