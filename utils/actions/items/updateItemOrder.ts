"use server";
import { auth } from "@clerk/nextjs/server";
import { UpdateItemOrderSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Item, List } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateItemOrder(data: z.infer<typeof UpdateItemOrderSchema>) {
  let updatedItems;
  try {
    const { userId } = auth();

    if (!userId) {
      console.log("Unauthorized");
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = UpdateItemOrderSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateItemOrder validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { items, boardId } = data;

    await db.transaction(async (db) => {
      for (const item of items) {
        await db
          .update(Item)
          .set({ order: item.order, listId: item.listId })
          .where(and(eq(Item.id, item.id), eq(Item.boardId, boardId)));
      }
    });
  } catch (error) {
    console.log("Failed to reorder items", error);
    return {
      error: "Failed to reorder items",
    };
  }
  // revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: updatedItems,
  };
}
