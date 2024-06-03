"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { copyBoardSchema } from "../../schemas";
import type { Board } from "@prisma/client";
import { z } from "zod";
import { checkIsPremium } from "@/utils/checkSubscription";
import { hasAvailableBoards, increaseBoardCount } from "./boardsLimit";
import { redirect } from "next/navigation";

// export async function copyBoard(data: z.infer<typeof copyBoardSchema>) {
//   let newBoard: Board;
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return {
//         error: "Unauthorized",
//       };
//     }

//     const validationResult = copyBoardSchema.safeParse(data);
//     if (!validationResult.success) {
//       console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);

//       return {
//         fieldErrors: validationResult.error.flatten().fieldErrors,
//       };
//     }

//     const { boardId, newId } = data;

//     const isPremium = await checkIsPremium();
//     const canCreateBoard = await hasAvailableBoards();

//     if (!isPremium && !canCreateBoard) {
//       console.log("No available boards");
//       return {
//         error: "Reached maximum number of free boards. Upgrade to premium to create more!",
//       };
//     }

//     const boardToCopy = await prisma.board.findUnique({
//       where: {
//         id: boardId,
//         userId,
//       },
//       include: {
//         lists: {
//           include: {
//             items: true,
//           },
//         },
//       },
//     });

//     if (!boardToCopy) {
//       return {
//         error: "Board not found",
//       };
//     }

//     newBoard = await prisma.board.create({
//       data: {
//         id: newId,
//         userId,
//         color: boardToCopy.color,
//         name: `${boardToCopy.name} (copy)`,
//         order: boardToCopy.order + 1,
//         backgroundColor: boardToCopy.backgroundColor,
//       },
//     });

//     // Then, create the lists and their items
//     for (const list of boardToCopy.lists) {
//       await prisma.list.create({
//         data: {
//           title: list.title,
//           order: list.order,
//           color: list.color,
//           boardId: newBoard.id,
//           items: {
//             createMany: {
//               data: list.items.map((item) => ({
//                 content: item.content,
//                 order: item.order,
//                 boardId: newBoard.id,
//                 color: item.color,
//               })),
//             },
//           },
//         },
//       });
//     }

//     if (!isPremium) {
//       await increaseBoardCount();
//     }

//     await prisma.board.updateMany({
//       where: {
//         userId,
//         id: {
//           not: newBoard.id,
//         },
//         order: {
//           gte: boardToCopy.order + 1,
//         },
//       },
//       data: {
//         order: {
//           increment: 1,
//         },
//       },
//     });
//   } catch (error) {
//     console.log("error", error);
//     return {
//       error: "Failed to copy board",
//     };
//   }
//   revalidatePath(`/dashboard`);
// }

export async function copyBoard(data: z.infer<typeof copyBoardSchema>) {
  let newBoard: Board;

  try {
    const { userId } = auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const validationResult = copyBoardSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("createBoard validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return { fieldErrors: validationResult.error.flatten().fieldErrors };
    }

    const { boardId, newId } = data;

    const [isPremium, canCreateBoard] = await Promise.all([checkIsPremium(), hasAvailableBoards()]);

    if (!isPremium && !canCreateBoard) {
      return { error: "Reached maximum number of free boards. Upgrade to premium to create more!", status: 403 };
    }

    const boardToCopy = await prisma.board.findUnique({
      where: { id: boardId, userId },
      include: {
        lists: { include: { items: true } },
      },
    });

    if (!boardToCopy) {
      return { error: "Board not found" };
    }

    await prisma.$transaction(async (prisma) => {
      newBoard = await prisma.board.create({
        data: {
          id: newId,
          userId,
          color: boardToCopy.color,
          name: `${boardToCopy.name} (copy)`,
          order: boardToCopy.order + 1,
          backgroundColor: boardToCopy.backgroundColor,
        },
      });

      const listData = boardToCopy.lists.map((list) => ({
        title: list.title,
        order: list.order,
        color: list.color,
        boardId: newBoard.id,
        items: list.items.map((item) => ({
          content: item.content,
          order: item.order,
          boardId: newBoard.id,
          color: item.color,
        })),
      }));

      for (const list of listData) {
        await prisma.list.create({
          data: {
            title: list.title,
            order: list.order,
            color: list.color,
            boardId: list.boardId,
            items: {
              createMany: {
                data: list.items,
              },
            },
          },
        });
      }
    });

    if (!isPremium) {
      await increaseBoardCount();
    }
  } catch (error) {
    console.log("error", error);
    return { error: "Failed to copy board" };
  }

  revalidatePath(`/dashboard`);
}
