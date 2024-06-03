"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { createItemSchema } from "../../schemas";
import { z } from "zod";

export async function createItem(data: z.infer<typeof createItemSchema>) {
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

    const { content, id, listId, order, boardId, color } = data;

    item = await prisma.item.create({
      data: {
        content,
        id,
        boardId,
        listId,
        order,
        color,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create item",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: item,
  };
}
