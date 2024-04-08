"use server";
import { auth } from "@clerk/nextjs/server";
import type { BoardType } from "@/store/store";
import prisma from "../../prisma";
import { createBoardSchema } from "../../schemas";
import { redirect } from "next/navigation";

export async function createBoard(data: BoardType) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = createBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name, id, color, backgroundColor, order } = data;

    await prisma.board.create({
      data: {
        name,
        id,
        userId,
        order,
        color,
        backgroundColor,
        lists: {
          create: [],
        },
      },
    });
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to create board",
    };
  }
  redirect(`/dashboard/${data.id}`);
}
