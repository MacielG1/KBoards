"use server";

import { auth } from "@clerk/nextjs/server";
import { copyBoardSchema } from "../../schemas";
import { z } from "zod";
import { checkIsPremium } from "@/utils/checkSubscription";
import { hasAvailableBoards, increaseBoardCount } from "./boardsLimit";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { Board, List, Item } from "@/drizzle/schema";

export async function copyBoard(data: z.infer<typeof copyBoardSchema>) {
  try {
    const { userId } = auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const validationResult = copyBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return { fieldErrors: validationResult.error.flatten().fieldErrors };
    }

    const { boardId, newId } = data;

    const [isPremium, canCreateBoard] = await Promise.all([checkIsPremium(), hasAvailableBoards()]);

    if (!isPremium && !canCreateBoard) {
      return { error: "Reached maximum number of free boards. Upgrade to premium to create more!", status: 403 };
    }

    const boardToCopy = await db.query.Board.findFirst({
      where: eq(Board.id, boardId),
      with: {
        lists: {
          with: {
            items: true,
          },
        },
      },
    });

    if (!boardToCopy) {
      return { error: "Board not found" };
    }

    await db.transaction(async (tx) => {
      const newBoard = await tx
        .insert(Board)
        .values({
          id: newId,
          userId,
          color: boardToCopy.color,
          name: `${boardToCopy.name} (copy)`,
          order: boardToCopy.order + 1,
          backgroundColor: boardToCopy.backgroundColor,
        })
        .returning({ id: Board.id });

      const newBoardId = newBoard[0].id;

      const listData = boardToCopy.lists.map((list) => ({
        title: list.title,
        order: list.order,
        color: list.color,
        boardId: newBoardId,
        items: list.items.map((item) => ({
          content: item.content,
          order: item.order,
          boardId: newBoardId,
          color: item.color,
        })),
      }));

      for (const list of listData) {
        const newList = await tx
          .insert(List)
          .values({
            title: list.title,
            order: list.order,
            color: list.color,
            boardId: list.boardId,
          })
          .returning({ id: List.id });

        const listId = newList[0].id;

        await tx.insert(Item).values(
          list.items.map((item) => ({
            content: item.content,
            order: item.order,
            boardId: item.boardId,
            color: item.color,
            listId: listId,
          })),
        );
      }
    });

    if (!isPremium) {
      await increaseBoardCount();
    }
  } catch (error) {
    console.log("error", error);
    return { error: "Failed to copy board" };
  }

  // revalidatePath(`/dashboard`);
}
