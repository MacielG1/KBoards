"use server";
import { revalidatePath } from "next/cache";
import type { BoardType } from "@/store/store";
import prisma from "../../prisma";
import { updateBoardSchema } from "../../schemas";
import { auth } from "@clerk/nextjs/server";

export async function updateBoard(data: BoardType) {
  let board;
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const validationResult = updateBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name, id } = data;

    board = await prisma.board.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }
  revalidatePath(`/dashboard/${data.id}`);

  return {
    data: board,
  };
}
