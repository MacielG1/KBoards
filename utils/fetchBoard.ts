import "server-only";

import { db } from "@/utils/db";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import { Board } from "@/drizzle/schema";

export async function fetchBoard({ boardId }: { boardId: string }) {
  try {
    const session = await auth();

    if (!session?.user?.id) return null;

    const { id } = session.user;

    const board = await db.query.Board.findFirst({
      where: and(eq(Board.id, boardId), eq(Board.userId, id)),
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
