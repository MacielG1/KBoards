"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { copyItemSchema } from "../../schemas";
import type { Item } from "@prisma/client";

export async function copyItem(data: { boardId: string; listId: string; newId: string; id: string }) {
  let newItem: Item;

  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }
    const validationResult = copyItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, listId, id, newId } = data;

    const itemToCopy = await prisma.item.findUnique({
      where: {
        id: id,
        boardId,
        listId,
      },
    });

    if (!itemToCopy) {
      return {
        error: "List not found",
      };
    }

    newItem = await prisma.item.create({
      data: {
        id: newId,
        content: itemToCopy.content,
        listId: itemToCopy.listId,
        boardId: itemToCopy.boardId,
        order: itemToCopy.order + 1,
      },
    });

    await prisma.item.updateMany({
      where: {
        boardId,
        listId,
        id: {
          not: newItem.id,
        },
        order: {
          gte: itemToCopy.order + 1,
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
      error: "Failed to copy Item",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
