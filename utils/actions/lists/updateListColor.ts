"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateListColorSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { and, eq } from "drizzle-orm";
import { List } from "@/drizzle/schema";

export async function updateListColor(data: z.infer<typeof updateListColorSchema>) {
  let list;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateListColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateListColor validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, boardId, color } = data;

    list = await db
      .update(List)
      .set({ color })
      .where(and(eq(List.id, id), eq(List.boardId, boardId)));
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }

  // revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: list,
  };
}
