"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma";
import { updateBoardOrderSchema } from "../../schemas";
import { z } from "zod";

export async function updateBoardOrder(data: z.infer<typeof updateBoardOrderSchema>) {
  let boards;

  try {
    const { userId } = auth();

    if (!userId) {
      console.log("Unauthorized");
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateBoardOrderSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateBoardOrder validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      console.log(validationResult);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }
    const transaction = data.map((board) =>
      prisma.board.update({
        where: {
          id: board.id,
          userId,
        },
        data: {
          order: board.order,
        },
      }),
    );

    boards = await prisma.$transaction(transaction);
  } catch (error) {
    console.log("Failed to reorder lists", error);
    return {
      error: "Failed to reorder lists",
    };
  }
  revalidatePath(`/dashboard`);

  return {
    data: boards,
  };
}
