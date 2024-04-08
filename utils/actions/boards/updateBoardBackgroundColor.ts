"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma";
import { updateBoardBackgroundColorSchema } from "../../schemas";

export async function updateBoardBackgroundColor(data: { id: string; backgroundColor: string }) {
  let board;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateBoardBackgroundColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, backgroundColor } = data;

    board = await prisma.board.update({
      where: {
        id,
      },
      data: {
        backgroundColor,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }
  revalidatePath(`/dashboard`);

  return {
    data: board,
  };
}
