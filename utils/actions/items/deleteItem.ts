"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { deleteItemSchema } from "../../schemas";
import { z } from "zod";

export async function deleteItem(data: z.infer<typeof deleteItemSchema>) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = deleteItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("deleteItem validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, boardId, listId } = data;

    await prisma.item.delete({
      where: {
        id,
        boardId,
        listId,
      },
    });

    await prisma.item.updateMany({
      where: {
        boardId,
        listId,
        id: {
          not: id,
        },
        order: {
          gte: data.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    console.log("Failed to delete item", error);
    return {
      error: "Failed to delete item",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
