"use server";
import { auth } from "@/auth";
import { deleteItemSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Item } from "@/drizzle/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteItem(data: z.infer<typeof deleteItemSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validationResult = deleteItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("deleteItem validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, boardId, listId } = data;

    await db.delete(Item).where(and(eq(Item.id, id), eq(Item.boardId, boardId), eq(Item.listId, listId)));

    await db
      .update(Item)
      .set({ order: sql`${Item.order} - 1` })
      .where(and(ne(Item.id, id), eq(Item.boardId, boardId), eq(Item.listId, listId), gte(Item.order, data.order)));
  } catch (error) {
    console.log("Failed to delete item", error);
    return {
      error: "Failed to delete item",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
