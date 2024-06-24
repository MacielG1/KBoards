import "server-only";

import { db } from "./db";
import { auth } from "@/auth";

export async function fetchBoards() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const { id } = session.user;

    const data = await db.query.Board.findMany({
      where: (board, { eq }) => eq(board.userId, id),
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
