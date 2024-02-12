"use server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { BoardType } from "@/store/store";
import prisma from "../prisma";

const deleteBoardSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters long",
    }),
  id: z.string(),
  color: z.string(),
  backgroundColor: z.string(),

  lists: z.array(z.object({})),
});

export async function deleteBoard(data: BoardType) {
  try {
    const validationResult = deleteBoardSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const { name, id, color, backgroundColor, lists } = data;

    await prisma.board.delete({
      where: {
        id,
        userId,
      },
    });

    // revalidatePath(`/board/${boardId}`);
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }
}
