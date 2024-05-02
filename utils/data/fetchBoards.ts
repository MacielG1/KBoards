import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function fetchBoards() {
  try {
    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const data = await prisma.board.findMany({
      where: {
        userId,
      },
      include: {
        lists: {
          include: {
            items: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all boards.");
  }
}
