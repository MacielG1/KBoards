import { FreeTierLimit } from "@/drizzle/schema";
import { LISTS_LIMIT } from "@/utils/constants";
import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function increaseListCount() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit) {
      await db.insert(FreeTierLimit).values({
        userId,
        listsCount: 1,
      });
    } else {
      await db
        .update(FreeTierLimit)
        .set({
          listsCount: limit.listsCount + 1,
        })
        .where(eq(FreeTierLimit.userId, userId));
    }
  } catch (error) {
    console.error("increaseListCount error", error);
    return error;
  }
}
export async function decreaseListCount() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit) {
      return;
    } else {
      await db
        .update(FreeTierLimit)
        .set({
          listsCount: limit.listsCount > 0 ? limit.listsCount - 1 : 0,
        })
        .where(eq(FreeTierLimit.userId, userId));
    }
  } catch (error) {
    console.error("decreaseListCount error", error);
    return error;
  }
}

export async function hasAvailableLists() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit || limit.listsCount < LISTS_LIMIT) return true;
    else return false;
  } catch (error) {
    console.error("hasAvailableLists error", error);
    return error;
  }
}

export async function getAvailableListCount() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit) return LISTS_LIMIT;
    else return LISTS_LIMIT - limit.listsCount;
  } catch (error) {
    console.error("getAvailableListCount error", error);
    return error;
  }
}
