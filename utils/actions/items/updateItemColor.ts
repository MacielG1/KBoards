"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma";
import { updateItemColorSchema } from "../../schemas";
import { z } from "zod";

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

    list = await prisma.item.update({
      where: {
        id: id,
        boardId: boardId,
      },
      data: {
        color,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update item color",
    };
  }

  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: list,
  };
}
