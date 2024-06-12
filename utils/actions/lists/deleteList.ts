"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteListSchema } from "../../schemas";
import { z } from "zod";
import { checkIsPremium } from "@/utils/checkSubscription";
import { decreaseListCount } from "./listslimit";
import { db } from "@/utils/db";
import { List } from "@/drizzle/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";

export async function deleteList(data: z.infer<typeof deleteListSchema>) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = deleteListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("deleteList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, boardId } = data;

    await db.delete(List).where(and(eq(List.id, id), eq(List.boardId, boardId)));

    await db
      .update(List)
      .set({
        order: sql`${List.order} - 1`,
      })
      .where(and(eq(List.boardId, boardId), ne(List.id, id), gte(List.order, data.order)));

    const isPremium = await checkIsPremium();

    if (!isPremium) {
      await decreaseListCount();
    }
  } catch (error) {
    console.log("Failed to delete list", error);
    return {
      error: "Failed to delete list",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
