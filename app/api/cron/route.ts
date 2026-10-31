import { db } from "@/utils/db";
import { NextResponse } from "next/server";

const cronKey = process.env.CRON_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("key");
  if (query !== cronKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timestamp = new Date().toISOString();

    // Keep-alive FIRST — must fire even when the database is paused/unreachable.
    // Supabase's free-tier pause logic only counts requests through its API
    // gateway; the Drizzle query below (direct Postgres) never registers. Two
    // signals: auth health + a REST call (a 401 still hits the gateway logs).
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (supabaseUrl && supabaseKey) {
      const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };
      const [health, rest] = await Promise.all([
        fetch(`${supabaseUrl}/auth/v1/health`, { headers }).catch(() => null),
        fetch(`${supabaseUrl}/rest/v1/board?select=id&limit=1`, { headers }).catch(() => null),
      ]);
      if (!health?.ok) {
        console.error(`[${timestamp}] Supabase auth health ping failed: ${health?.status ?? 'no response'}`);
      }
      if (!rest) {
        console.error(`[${timestamp}] Supabase REST ping failed (no response)`);
      }
    }

    await db.query.Board.findMany({
      limit: 1,
      columns: {
        id: true,
      },
    });

    return NextResponse.json(
      {
        message: "Success",
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Connection failed:`, error);
    return NextResponse.json(
      {
        error: "Database connection failed",
        timestamp,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
