"use server";
import { auth } from "@clerk/nextjs/server";
import { moveListSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { List } from "@/drizzle/schema";

export async function moveList(data: z.infer<typeof moveListSchema>) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = moveListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("moveList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { boardId, listId: id } = data;

    const listToMove = await db.query.List.findFirst({
      where: eq(List.id, id),
    });

    if (!listToMove) {
      return {
        error: "List not found",
      };
    }

    const countResult = await db.select({ count: count() }).from(List).where(eq(List.boardId, boardId));

    const order = countResult[0]?.count ?? 0;

    await db.update(List).set({ boardId, order }).where(eq(List.id, id));

    await db
      .update(List)
      .set({ order: sql`${List.order} - 1` })
      .where(and(eq(List.boardId, listToMove.boardId), gt(List.order, listToMove.order)));
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to move list",
    };
  }
  // revalidatePath(`/dashboard/${data.boardId}`);
}
