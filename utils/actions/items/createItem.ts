"use server";
import { auth } from "@clerk/nextjs/server";
import { createItemSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Item } from "@/drizzle/schema";

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

    item = await db.insert(Item).values({
      content,
      id,
      boardId,
      listId,
      order,
      color,
    });
  } catch (error) {
    return {
      error: "Failed to create item",
    };
  }
  // revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: item,
  };
}
