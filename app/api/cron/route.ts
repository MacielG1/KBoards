import { db } from "@/utils/db";
import { NextResponse } from "next/server";

const cronKey = process.env.CRON_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("key");
  if (query !== cronKey) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  try {
    await db.query.Board.findFirst();
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" });
  }
}
