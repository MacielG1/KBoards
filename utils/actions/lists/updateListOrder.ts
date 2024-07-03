"use server";
import { auth } from "@/auth";
import { updateListOrderSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { List } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateListOrder(data: z.infer<typeof updateListOrderSchema>, boardId: string) {
  let updatedLists;

  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validationResult = updateListOrderSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateListOrder validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, lists } = data;

    console.log("data", data);

    await db.transaction(async (db) => {
      for (const list of lists) {
        await db
          .update(List)
          .set({ order: list.order })
          .where(and(eq(List.id, list.id), eq(List.boardId, boardId)));
      }
    });
  } catch (error) {
    console.log("Failed to reorder lists", error);
    return {
      error: "Failed to reorder lists",
    };
  }
  revalidatePath(`/dashboard/${boardId}`);

  return {
    data: updatedLists,
  };
}
