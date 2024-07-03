"use server";
import { auth } from "@/auth";
import { createBoardSchema } from "../../schemas";
import { hasAvailableBoards, increaseBoardCount } from "./boardsLimit";
import { checkIsPremium } from "@/utils/checkSubscription";
import { z } from "zod";
import { db } from "@/utils/db";
import { Board } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBoard(data: z.infer<typeof createBoardSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    const validationResult = createBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name, id, color, backgroundColor, order } = data;

    const [isPremium, canCreateBoard] = await Promise.all([checkIsPremium(), hasAvailableBoards()]);

    if (!isPremium && !canCreateBoard) {
      return {
        error: "Reached maximum number of free boards. Upgrade to premium to create more!",
        status: 403,
      };
    }

    await db.insert(Board).values({
      name,
      id,
      userId,
      order,
      color,
      backgroundColor,
    });

    if (!isPremium) {
      await increaseBoardCount();
    }
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to create board",
    };
  }
  revalidatePath("/dashboard");
  // redirect(`/dashboard/${data.id}`);
}
