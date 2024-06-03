"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma";
import { updateListSchema } from "../../schemas";
import { z } from "zod";

export async function updateList(data: z.infer<typeof updateListSchema>) {
  let list;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { title, id, boardId } = data;

    list = await prisma.list.update({
      where: {
        id,
        boardId,
      },
      data: {
        title,
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
