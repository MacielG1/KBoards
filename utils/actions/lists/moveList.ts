"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { moveListSchema } from "../../schemas";

export async function moveList(data: { boardId: string; listId: string }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = moveListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, listId: id } = data;

    const listToMove = await prisma.list.findUnique({
      where: {
        id: id,
        Board: {
          userId,
        },
      },
    });

    if (!listToMove) {
      return {
        error: "List not found",
      };
    }

    await prisma.list.update({
      where: {
        id,
      },
      data: {
        boardId,
        order: await prisma.list.count({
          where: {
            boardId,
          },
        }),
      },
    });

    // update order of lists from original board
    await prisma.list.updateMany({
      where: {
        boardId: listToMove.boardId,
        order: {
          gt: listToMove.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to copy board",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
