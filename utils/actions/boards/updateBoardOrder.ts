"use server";
import { auth } from "@/auth";
import { updateBoardOrderSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBoardOrder(data: z.infer<typeof updateBoardOrderSchema>) {
  let boards;

  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    const validationResult = updateBoardOrderSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateBoardOrder validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      console.log(validationResult);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    console.log("data", data);

    await db.transaction(async (db) => {
      for (const board of data) {
        await db
          .update(Board)
          .set({ order: board.order })
          .where(and(eq(Board.id, board.id), eq(Board.userId, userId)));
      }
    });
  } catch (error) {
    console.log("Failed to reorder lists", error);
    return {
      error: "Failed to reorder lists",
    };
  }
  revalidatePath(`/dashboard`);

  return {
    data: boards,
  };
}
