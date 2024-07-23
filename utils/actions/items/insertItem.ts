//used to insert a new item above or below the current item

"use server";
import { auth } from "@/auth";

import { z } from "zod";
import { db } from "@/utils/db";
import { and, eq, gte, ne, sql } from "drizzle-orm";
import { Item } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { insertItemSchema } from "@/utils/schemas";

export async function insertItem(data: z.infer<typeof insertItemSchema>, insertType: "above" | "below") {
  let newItem;

  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validationResult = insertItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("insertItem validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, listId, id, color, order } = data;

    newItem = await db.insert(Item).values({
      id,
      content: "",
      listId: listId,
      boardId: boardId,
      order: insertType === "above" ? order : order + 1,
      color,
    });

    await db
      .update(Item)
      .set({ order: sql`${Item.order} + 1` })
      .where(and(ne(Item.id, id), eq(Item.boardId, boardId), eq(Item.listId, listId), gte(Item.order, insertType === "above" ? order : order + 1)));
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to copy Item",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
