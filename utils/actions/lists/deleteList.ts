"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { deleteListSchema } from "../../schemas";
import { z } from "zod";
import { checkIsPremium } from "@/utils/checkSubscription";
import { decreaseListCount } from "./listslimit";

export async function deleteList(data: z.infer<typeof deleteListSchema>) {
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

    const isPremium = await checkIsPremium();

    if (!isPremium) {
      await decreaseListCount();
    }
  } catch (error) {
    console.log("Failed to delete list", error);
    return {
      error: "Failed to delete list",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
