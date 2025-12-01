"use server";
import { auth } from "@/auth";
import { db } from "@/utils/db";
import { Item } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function clearBoardChecklist(boardId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await db
      .update(Item)
      .set({ checked: false })
      .where(and(eq(Item.boardId, boardId)));

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to clear checklist",
    };
  }
}


