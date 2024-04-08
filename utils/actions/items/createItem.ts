"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import type { ItemType } from "@/store/store";
import prisma from "../../prisma";
import { createItemSchema } from "../../schemas";

export async function createItem(data: ItemType) {
  let item;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = createItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createItem validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { content, id, listId, order, boardId } = data;

    item = await prisma.item.create({
      data: {
        content,
        id,
        boardId,
        listId,
        order,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create list",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: item,
  };
}
