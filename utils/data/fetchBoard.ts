import "server-only";

import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function fetchBoard({ boardId }: { boardId: string }) {
  console.log("fetchBoard", boardId);
  try {
    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        userId,
      },
      include: {
        lists: {
          orderBy: {
            order: "asc",
          },
          include: {
            items: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    return board;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all boards.");
  }
}
