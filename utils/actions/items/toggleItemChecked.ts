"use server";
import { auth } from "@/auth";
import { db } from "@/utils/db";
import { Item } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleItemChecked(itemId: string, listId: string, boardId: string, checked: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await db
      .update(Item)
      .set({ checked })
      .where(and(eq(Item.id, itemId), eq(Item.listId, listId), eq(Item.boardId, boardId)));

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to toggle item checked state",
    };
  }
}
