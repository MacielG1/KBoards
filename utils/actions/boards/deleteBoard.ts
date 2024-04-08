"use server";
import { auth } from "@clerk/nextjs/server";
import type { BoardType } from "@/store/store";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { deleteBoardSchema } from "../../schemas";

export async function deleteBoard(data: BoardType) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = deleteBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("deleteBoard validationResult.error", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id } = data;

    await prisma.board.delete({
      where: {
        id,
        userId,
      },
    });

    await prisma.board.updateMany({
      where: {
        userId,
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
    return {
      error: "Failed to delete board",
    };
  }
  revalidatePath("/dashboard");
}
