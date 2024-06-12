import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
// import * as schema from "../drizzle/migrations/schema.ts";
export const client = postgres(process.env.DATABASE_URL!, {
  max: 1,
  prepare: false,
});

export const db = drizzle(client, {
  // logger: true,
  schema,
});
