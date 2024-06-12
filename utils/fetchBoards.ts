import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export async function fetchBoards() {
  try {
    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const data = await db.query.Board.findMany({
      where: (board, { eq }) => eq(board.userId, userId),
      orderBy: (board, { asc }) => [asc(board.order)],

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

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all boards.");
  }
}
