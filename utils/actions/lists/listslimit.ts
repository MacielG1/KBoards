import { LISTS_LIMIT } from "@/utils/constants";
import prisma from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";

export async function increaseListCount() {
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
          listsCount: 1,
        },
      });
    } else {
      await prisma.freeTierLimit.update({
        where: {
          userId,
        },
        data: {
          listsCount: limit.listsCount + 1,
        },
      });
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
          listsCount: limit.listsCount > 0 ? limit.listsCount - 1 : 0,
        },
      });
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

    const limit = await prisma.freeTierLimit.findUnique({
      where: {
        userId,
      },
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

    const limit = await prisma.freeTierLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!limit) return LISTS_LIMIT;
    else return LISTS_LIMIT - limit.listsCount;
  } catch (error) {
    console.error("getAvailableListCount error", error);
    return error;
  }
}
