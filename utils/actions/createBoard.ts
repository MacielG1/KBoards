"use server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { BoardType } from "@/store/store";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

const createBoardSchema = z.object({
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

export async function createBoard(data: BoardType) {
  try {
    const validationResult = createBoardSchema.safeParse(data);
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

    let board = await prisma.board.create({
      data: {
        name,
        id,
        userId,
        color,
        backgroundColor,
        lists: {
          create: lists,
        },
      },
    });

    revalidatePath(`/dashbaord`);

    return {
      data: board,
    };
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }
}
