"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { deleteBoardSchema } from "../../schemas";
import { decreaseBoardCount } from "./boardsLimit";
import { checkIsPremium } from "@/utils/checkSubscription";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function deleteBoard(data: z.infer<typeof deleteBoardSchema>) {
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

    const isPremium = await checkIsPremium();

    if (!isPremium) {
      await decreaseBoardCount();
    }
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }
  // revalidatePath("/dashboard");
}
