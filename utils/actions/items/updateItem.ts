"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { ItemType } from "@/store/store";
import prisma from "../../prisma";
import { updateItemSchema } from "../../schemas";

export async function updateItem(data: ItemType) {
  let item;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateItem validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { content, id, listId } = data;

    item = await prisma.item.update({
      where: {
        id,
        listId,
      },
      data: {
        content,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: item,
  };
}
