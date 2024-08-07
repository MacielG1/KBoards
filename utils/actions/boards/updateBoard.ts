"use server";
import { revalidatePath } from "next/cache";
import { updateBoardSchema } from "../../schemas";
import { auth } from "@/auth";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateBoard(data: z.infer<typeof updateBoardSchema>) {
  let board;

  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const { id: userId } = session.user;

  try {
    const validationResult = updateBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name, id } = data;

    board = await db
      .update(Board)
      .set({ name })
      .where(and(eq(Board.id, id), eq(Board.userId, userId)));
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }
  revalidatePath(`/dashboard/${data.id}`);

  return {
    data: board,
  };
}
