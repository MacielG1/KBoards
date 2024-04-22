import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

const cronKey = process.env.CRON_KEY;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("key");
  if (query !== cronKey) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  try {
    await prisma.board.findFirst();
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" });
  }
}
