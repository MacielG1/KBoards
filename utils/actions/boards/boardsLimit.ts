import { FreeTierLimit } from "@/drizzle/schema";
import { BOARDS_LIMIT } from "@/utils/constants";
import { db } from "@/utils/db";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function increaseBoardCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const { id: userId } = session.user;

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit) {
      await db.insert(FreeTierLimit).values({
        userId,
        boardsCount: 1,
      });
    } else {
      await db
        .update(FreeTierLimit)
        .set({
          boardsCount: limit.boardsCount + 1,
        })
        .where(eq(FreeTierLimit.userId, userId));
    }
  } catch (error) {
    console.error("increaseBoardCount error", error);
    return error;
  }
}
export async function decreaseBoardCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { id: userId } = session.user;

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit) {
      return;
    } else {
      await db
        .update(FreeTierLimit)
        .set({
          boardsCount: limit.boardsCount > 0 ? limit.boardsCount - 1 : 0,
        })
        .where(eq(FreeTierLimit.userId, userId));
    }
  } catch (error) {
    console.error("decreaseBoardCount error", error);
    return error;
  }
}

export async function hasAvailableBoards() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { id: userId } = session.user;

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit || limit.boardsCount < BOARDS_LIMIT) return true;
    else return false;
  } catch (error) {
    console.error("hasAvailableBoards error", error);
    return error;
  }
}

export async function getAvailableBoardCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { id: userId } = session.user;

    const limit = await db.query.FreeTierLimit.findFirst({
      where: eq(FreeTierLimit.userId, userId),
    });

    if (!limit) return BOARDS_LIMIT;
    else return BOARDS_LIMIT - limit.boardsCount;
  } catch (error) {
    console.error("getAvailableBoardCount error", error);
    return error;
  }
}
