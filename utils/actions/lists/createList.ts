"use server";
import { auth } from "@clerk/nextjs/server";
import { createListSchema } from "../../schemas";
import { z } from "zod";
import { checkIsPremium } from "@/utils/checkSubscription";
import { hasAvailableLists, increaseListCount } from "./listslimit";
import { db } from "@/utils/db";
import { List } from "@/drizzle/schema";

export async function createList(data: z.infer<typeof createListSchema>) {
  let list;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = createListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const [isPremium, canCreateList] = await Promise.all([checkIsPremium(), hasAvailableLists()]);

    if (!isPremium && !canCreateList) {
      return {
        error: "Reached maximum number of free lists. Upgrade to premium to create more!",
        status: 403,
      };
    }

    const { title, id, items, color, order, boardId } = data;

    list = await db.insert(List).values({
      title,
      id,
      color,
      order,
      boardId,
    });

    if (!isPremium) {
      await increaseListCount();
    }
  } catch (error) {
    return {
      error: "Failed to create list",
    };
  }
  // revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: list,
  };
}
