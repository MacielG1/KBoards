import { z } from "zod";

export const createBoardSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, {
      message: "Name must be at least 1 characters long",
    }),
  id: z.string(),
  color: z.string(),
  backgroundColor: z.string(),

  lists: z.array(z.object({})),
});

export const createListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, {
      message: "Title must be at least 1 characters long",
    }),
  id: z.string(),
  items: z.array(z.object({})),
  color: z.string(),
  order: z.number(),
  boardId: z.string(),
});

export const createItemSchema = z.object({
  content: z
    .string({
      required_error: "Title is required",
    })
    .min(1, {
      message: "Title must be at least 1 characters long",
    }),
  id: z.string(),
  boardId: z.string(),
  order: z.number(),
  listId: z.string(),
});

export const updateBoardSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, {
      message: "Name must be at least 1 characters long",
    }),
  id: z.string(),
});

export const setCurrentBoardSchema = z.object({
  id: z.string(),
});

export const updateListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, {
      message: "Title must be at least 1 characters long",
    }),
  id: z.string(),
  boardId: z.string(),
});

export const updateItemSchema = z.object({
  content: z
    .string({
      required_error: "Title is required",
    })
    .min(1, {
      message: "Title must be at least 1 characters long",
    }),
  id: z.string(),
  boardId: z.string(),
  listId: z.string(),
});

export const updateBoardOrderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
  }),
);

export const updateListOrderSchema = z.object({
  id: z.string(),
  order: z.number(),
});

export const UpdateItemOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
  boardId: z.string(),
});

export const deleteBoardSchema = z.object({
  id: z.string(),
});

export const deleteListSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export const deleteItemSchema = z.object({
  id: z.string(),
  boardId: z.string(),
  listId: z.string(),
});

export const updateBoardBackgroundColorSchema = z.object({
  id: z.string(),
  backgroundColor: z.string(),
});

export const updateBoardColorSchema = z.object({
  id: z.string(),
  color: z.string(),
});

export const updateListColorSchema = z.object({
  id: z.string(),
  boardId: z.string(),
  color: z.string(),
});

export const updateItemColorSchema = z.object({
  id: z.string(),
  color: z.string(),
  boardId: z.string(),
});

export const copyItemSchema = z.object({
  boardId: z.string(),
  listId: z.string(),
  newId: z.string(),
  id: z.string(),
  color: z.string(),
});

export const copyListSchema = z.object({
  boardId: z.string(),
  newId: z.string(),
  listId: z.string(),
});

export const copyBoardSchema = z.object({
  boardId: z.string(),
  newId: z.string(),
});

export const moveListSchema = z.object({
  boardId: z.string(),
  listId: z.string(),
});
