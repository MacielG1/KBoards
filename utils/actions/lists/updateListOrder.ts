"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import type { ListType } from "@/store/store";
import prisma from "../../prisma";
import { updateListOrderSchema } from "../../schemas";

export async function updateListOrder(data: { lists: ListType[]; id: string }, boardId: string) {
  let updatedLists;
  try {
    const { userId } = auth();

    if (!userId) {
      console.log("Unauthorized");
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateListOrderSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateListOrder validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { lists, id } = data;

    const transaction = lists.map((list) =>
      prisma.list.update({
        where: {
          id: list.id,
          boardId: id,
        },
        data: {
          order: list.order,
        },
      }),
    );
    updatedLists = await prisma.$transaction(transaction);
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
