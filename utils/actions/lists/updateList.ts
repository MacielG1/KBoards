"use server";
import { auth } from "@/auth";
import { updateListSchema } from "../../schemas";
import { z } from "zod";
import { db } from "@/utils/db";
import { List } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateList(data: z.infer<typeof updateListSchema>) {
  let list;
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validationResult = updateListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { title, id, boardId } = data;

    list = await db
      .update(List)
      .set({ title })
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
