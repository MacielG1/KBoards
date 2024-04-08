import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const cronKey = process.env.CRON_KEY;

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const cronKey = process.env.CRON_KEY;

  if (req.query.key !== cronKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await prisma.board.findFirst();
    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
