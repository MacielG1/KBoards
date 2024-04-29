"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma";
import { updateListColorSchema } from "../../schemas";

export async function updateListColor(data: { id: string; boardId: string; color: string }) {
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
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, boardId, color } = data;

    list = await prisma.list.update({
      where: {
        id,
        boardId,
      },
      data: {
        color,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }

  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: list,
  };
}
