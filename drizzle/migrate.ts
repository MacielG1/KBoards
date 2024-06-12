import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "../utils/db";

async function main() {
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
  await client.end();
}

main();
