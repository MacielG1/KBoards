"use server";
import { revalidatePath } from "next/cache";
import { updateBoardBackgroundColorSchema } from "../../schemas";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function updateBoardBackgroundColor(data: z.infer<typeof updateBoardBackgroundColorSchema>) {
  let board;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateBoardBackgroundColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, backgroundColor } = data;

    board = await db.update(Board).set({ backgroundColor }).where(eq(Board.id, id));
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }
  revalidatePath(`/dashboard`);

  return {
    data: board,
  };
}
