"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { copyBoardSchema } from "../../schemas";
import type { Board } from "@prisma/client";

export async function copyBoard(data: { boardId: string; newId: string }) {
  let newBoard: Board;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = copyBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, newId } = data;

    const boardToCopy = await prisma.board.findUnique({
      where: {
        id: boardId,
        userId,
      },
      include: {
        lists: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!boardToCopy) {
      return {
        error: "Board not found",
      };
    }

    newBoard = await prisma.board.create({
      data: {
        id: newId,
        userId,
        color: boardToCopy.color,
        name: `${boardToCopy.name} (copy)`,
        order: boardToCopy.order + 1,
        backgroundColor: boardToCopy.backgroundColor,
      },
    });

    // Then, create the lists and their items
    for (const list of boardToCopy.lists) {
      await prisma.list.create({
        data: {
          title: list.title,
          order: list.order,
          color: list.color,
          boardId: newBoard.id,
          items: {
            createMany: {
              data: list.items.map((item) => ({
                content: item.content,
                order: item.order,
                boardId: newBoard.id,
              })),
            },
          },
        },
      });
    }

    await prisma.board.updateMany({
      where: {
        userId,
        id: {
          not: newBoard.id,
        },
        order: {
          gte: boardToCopy.order + 1,
        },
      },
      data: {
        order: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to copy board",
    };
  }
  revalidatePath(`/dashboard`);
}
