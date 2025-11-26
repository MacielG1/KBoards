"use server";
import { auth } from "@/auth";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleBoardChecklistMode(boardId: string, checklistMode: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await db
      .update(Board)
      .set({ checklistMode })
      .where(and(eq(Board.id, boardId), eq(Board.userId, session.user.id)));

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to toggle checklist mode",
    };
  }
}
