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
