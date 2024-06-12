"use server";
import { auth } from "@clerk/nextjs/server";
import { updateItemSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Item } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateItem(data: z.infer<typeof updateItemSchema>) {
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

    item = await db
      .update(Item)
      .set({
        content,
      })
      .where(and(eq(Item.id, id), eq(Item.listId, listId)));
  } catch (error) {
    return {
      error: "Failed to update item",
    };
  }
  // revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: item,
  };
}
