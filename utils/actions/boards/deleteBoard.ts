"use server";

import { deleteBoardSchema } from "../../schemas";
import { decreaseBoardCount } from "./boardsLimit";
import { checkIsPremium } from "@/utils/checkSubscription";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteBoard(data: z.infer<typeof deleteBoardSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    const validationResult = deleteBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("deleteBoard validationResult.error", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id } = data;

    await db.delete(Board).where(and(eq(Board.id, id), eq(Board.userId, userId)));

    await db
      .update(Board)
      .set({
        order: sql`${Board.order} - 1`,
      })
      .where(and(eq(Board.userId, userId), ne(Board.id, id), gte(Board.order, data.order)));

    const isPremium = await checkIsPremium();

    if (!isPremium) {
      await decreaseBoardCount();
    }
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }
  // revalidatePath("/dashboard");
}
