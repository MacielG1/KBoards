"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import type { ListType } from "@/store/store";
import prisma from "../../prisma";
import { createListSchema } from "../../schemas";

export async function createList(data: ListType) {
  let list;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = createListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { title, id, items, color, order, boardId } = data;

    list = await prisma.list.create({
      data: {
        title,
        id,
        items: {
          create: items,
        },
        color,
        order,
        boardId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create list",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: list,
  };
}
