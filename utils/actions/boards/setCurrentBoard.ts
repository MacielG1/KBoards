"use server";
import { revalidatePath } from "next/cache";
import type { BoardType } from "@/store/store";
import prisma from "../../prisma";
import { updateBoardSchema, setCurrentBoardSchema } from "../../schemas";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function setCurrentBoard({ id }: { id: string }) {
  let board;
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const validationResult = setCurrentBoardSchema.safeParse({ id });
    if (!validationResult.success) {
      console.log("setCurrentBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    board = await prisma.userSettings.upsert({
      where: {
        userId,
      },
      update: {
        id,
      },
      create: {
        id,
        userId,
      },
    });
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to update list",
    };
  }

  revalidatePath(`/dashboard/${id}`);

  return {
    data: board,
  };
}
