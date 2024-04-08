"use server";
import { auth } from "@clerk/nextjs/server";
import type { ListType } from "@/store/store";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { deleteListSchema } from "../../schemas";

export async function deleteList(data: ListType) {
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

    await prisma.list.delete({
      where: {
        id,
        boardId,
      },
    });

    await prisma.list.updateMany({
      where: {
        boardId,
        id: {
          not: id,
        },
        order: {
          gte: data.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    console.log("Failed to delete board", error);
    return {
      error: "Failed to delete board",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
