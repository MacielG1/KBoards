import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";

export async function fetchBoard({ boardId }: { boardId: string }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const board = await db.query.Board.findFirst({
      where: (board, { eq, and }) => and(eq(board.id, boardId), eq(board.userId, userId)),
      with: {
        lists: {
          orderBy: (List, { asc }) => [asc(List.order)],
          with: {
            items: {
              orderBy: (Item, { asc }) => [asc(Item.order)],
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
