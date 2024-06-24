"use server";
import { auth } from "@/auth";

import { copyItemSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { and, eq, gte, ne } from "drizzle-orm";
import { Item } from "@/drizzle/schema";

export async function copyItem(data: z.infer<typeof copyItemSchema>) {
  let newItem;

  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validationResult = copyItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("copyItem validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, listId, id, newId, color } = data;

    const itemToCopy = await db.query.Item.findFirst({
      where: and(eq(Item.id, id), eq(Item.boardId, boardId), eq(Item.listId, listId)),
    });

    if (!itemToCopy) {
      return {
        error: "List not found",
      };
    }

    newItem = await db.insert(Item).values({
      id: newId,
      content: itemToCopy.content,
      listId: itemToCopy.listId,
      boardId: itemToCopy.boardId,
      order: itemToCopy.order + 1,
      color,
    });

    await db
      .update(Item)
      .set({ order: itemToCopy.order + 1 })
      .where(and(ne(Item.id, newId), eq(Item.boardId, boardId), eq(Item.listId, listId), gte(Item.order, itemToCopy.order + 1)));
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to copy Item",
    };
  }
  // revalidatePath(`/dashboard/${data.boardId}`);
}
