"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { copyListSchema } from "../../schemas";
import type { List } from "@prisma/client";

export async function copyList(data: { boardId: string; listId: string; newId: string }) {
  let newList: List;

  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = copyListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, listId: id, newId } = data;

    const listToCopy = await prisma.list.findUnique({
      where: {
        id: id,
        Board: {
          id: boardId,
          userId,
        },
      },
      include: {
        items: true,
      },
    });

    if (!listToCopy) {
      return {
        error: "List not found",
      };
    }

    newList = await prisma.list.create({
      data: {
        id: newId,
        title: `${listToCopy.title} (copy)`,
        color: listToCopy.color,
        order: listToCopy.order + 1,
        boardId: listToCopy.boardId,
        items: {
          createMany: {
            data: listToCopy.items.map((item) => ({
              content: item.content,
              order: item.order,
              boardId: listToCopy.boardId,
            })),
          },
        },
      },
    });

    await prisma.list.updateMany({
      where: {
        Board: {
          userId,
          id: listToCopy.boardId,
        },
        id: {
          not: newList.id,
        },
        order: {
          gte: listToCopy.order + 1,
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
  revalidatePath(`/dashboard/${data.boardId}`);
}
