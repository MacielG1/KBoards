import { BOARDS_LIMIT } from "@/utils/constants";
import prisma from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";

export async function increaseBoardCount() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await prisma.freeTierLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!limit) {
      await prisma.freeTierLimit.create({
        data: {
          userId,
          boardsCount: 1,
        },
      });
    } else {
      await prisma.freeTierLimit.update({
        where: {
          userId,
        },
        data: {
          boardsCount: limit.boardsCount + 1,
        },
      });
    }
  } catch (error) {
    console.error("increaseBoardCount error", error);
    return error;
  }
}
export async function decreaseBoardCount() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await prisma.freeTierLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!limit) {
      return;
    } else {
      await prisma.freeTierLimit.update({
        where: {
          userId,
        },
        data: {
          boardsCount: limit.boardsCount > 0 ? limit.boardsCount - 1 : 0,
        },
      });
    }
  } catch (error) {
    console.error("decreaseBoardCount error", error);
    return error;
  }
}

export async function hasAvailableBoards() {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await prisma.freeTierLimit.findUnique({
      where: {
        userId,
      },
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
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const limit = await prisma.freeTierLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!limit) return BOARDS_LIMIT;
    else return BOARDS_LIMIT - limit.boardsCount;
  } catch (error) {
    console.error("getAvailableBoardCount error", error);
    return error;
  }
}
