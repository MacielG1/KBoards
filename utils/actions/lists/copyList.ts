"use server";
import { auth } from "@/auth";
import { copyListSchema } from "../../schemas";
import { z } from "zod";
import { checkIsPremium } from "@/utils/checkSubscription";
import { hasAvailableLists, increaseListCount } from "./listslimit";
import { db } from "@/utils/db";
import { and, eq, gte, ne } from "drizzle-orm";
import { Item, List } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

export async function copyList(data: z.infer<typeof copyListSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validationResult = copyListSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("copyList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const [isPremium, canCreateList] = await Promise.all([checkIsPremium(), hasAvailableLists()]);

    if (!isPremium && !canCreateList) {
      return { error: "Reached maximum number of free lists. Upgrade to premium to create more!", status: 403 };
    }

    const { boardId, listId: id, newId } = data;

    const listToCopy = await db.query.List.findFirst({
      where: and(eq(List.id, id), eq(List.boardId, boardId)),
      with: {
        items: true,
      },
    });

    if (!listToCopy) {
      return {
        error: "List not found",
      };
    }

    await db.transaction(async (tx) => {
      const newBoard = await tx
        .insert(List)
        .values({
          id: newId,
          title: `${listToCopy.title} (copy)`,
          color: listToCopy.color,
          order: listToCopy.order + 1,
          boardId: listToCopy.boardId,
        })
        .returning({ id: List.id });

      const newListId = newBoard[0].id;

      const itemData = listToCopy.items.map((item) => ({
        content: item.content,
        order: item.order,
        boardId: listToCopy.boardId,
        color: item.color,
        listId: newListId,
      }));

      await tx.insert(Item).values(itemData);

      await tx
        .update(List)
        .set({
          order: listToCopy.order + 1,
        })
        .where(and(ne(List.id, newId), eq(List.boardId, boardId), gte(List.order, listToCopy.order + 1)));
    });

    if (!isPremium) {
      await increaseListCount();
    }
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to copy list",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);
}
