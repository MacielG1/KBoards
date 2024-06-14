"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateItemColorSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { Item } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateItemColor(data: z.infer<typeof updateItemColorSchema>) {
  let list;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateItemColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateItemColor validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, color, boardId } = data;

    list = await db
      .update(Item)
      .set({
        color,
      })
      .where(and(eq(Item.id, id), eq(Item.boardId, boardId)));
  } catch (error) {
    return {
      error: "Failed to update item color",
    };
  }

  // revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: list,
  };
}
