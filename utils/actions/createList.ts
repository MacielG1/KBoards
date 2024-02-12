"use server";
import { z } from "zod";
// import prisma from "@/utils/db";
// import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
// import { createAuditLog } from "@/utils/createAuditLog";
// import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { BoardType, ListType } from "@/store/store";
import prisma from "../prisma";

const createListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(2, {
      message: "Title must be at least 2 characters long",
    }),
  id: z.string(),
  // items: z.array(z.object({})),
  color: z.string(),
  order: z.number(),
  boardId: z.string(),
});

export async function createList(data: ListType) {
  try {
    const validationResult = createListSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const { title, id, items, color, order, boardId } = data;

    let list = await prisma.list.create({
      data: {
        title,
        id,
        // items: {
        //   create: items,
        // },
        color,
        order,
        boardId,
      },
    });

    // revalidatePath(`/board/${boardId}`);

    return {
      data: list,
    };
  } catch (error) {
    return {
      error: "Failed to create list",
    };
  }
}
