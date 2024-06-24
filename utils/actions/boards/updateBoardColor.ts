"use server";
import { revalidatePath } from "next/cache";
import { updateBoardColorSchema } from "../../schemas";
import { auth } from "@/auth";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateBoardColor(data: z.infer<typeof updateBoardColorSchema>) {
  let board;

  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    const validationResult = updateBoardColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, color } = data;

    board = await db
      .update(Board)
      .set({ color })
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
