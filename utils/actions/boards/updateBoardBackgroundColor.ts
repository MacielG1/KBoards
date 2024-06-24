"use server";
import { revalidatePath } from "next/cache";
import { updateBoardBackgroundColorSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function updateBoardBackgroundColor(data: z.infer<typeof updateBoardBackgroundColorSchema>) {
  let board;
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    const validationResult = updateBoardBackgroundColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, backgroundColor } = data;

    board = await db
      .update(Board)
      .set({ backgroundColor })
      .where(and(eq(Board.id, id), eq(Board.userId, userId)));
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }
  // revalidatePath(`/dashboard`);

  return {
    data: board,
  };
}
