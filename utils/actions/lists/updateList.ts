"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import type { ListType } from "@/store/store";
import prisma from "../../prisma";
import { updateListSchema } from "../../schemas";

export async function updateList(data: ListType) {
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
