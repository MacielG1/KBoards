import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export const defaultBoards: BoardType[] = [
  {
    id: "main",
    name: "Main",
    color: "#000000",
    lists: [
      {
        id: "list-1",
        title: "List 1",
        color: "#ff0000",
        order: 1,
        items: [
          {
            id: "item-1",
            content: "Item 1",
            listId: "list-1",
            order: 1,
          },
          {
            id: "item-2",
            content: "Item 2",
            listId: "list-1",
            order: 2,
          },
        ],
      },
      {
        id: "list-2",
        title: "List 2",
        color: "#00ff00",
        order: 2,
        items: [
          {
            id: "item-3",
            content: "Item 3",
            listId: "list-2",
            order: 1,
          },
          {
            id: "item-4",
            content: "Item 4",
            listId: "list-2",
            order: 2,
          },
        ],
      },
    ],
  },
];

export type ListType = {
  id: string;
  title: string;
  items: ItemType[];
  color: string;
  order: number;
};

export type ItemType = {
  id: string;
  content: string;
  listId: string;
  order: number;
};

export type BoardType = {
  id: string;
  name: string;
  color: string;
  lists: ListType[];
};

export type StoreType = {
  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;

  addBoard: (board: BoardType) => void;
  removeBoard: (boardId: string) => void;
  copyBoard: (boardId: string) => void;

  setBoardTitle: (boardId: string, name: string) => void;
  updateBoard: (boardId: string, updatedBoard: Partial<BoardType>) => void;

  addList: (boardId: string, title: string) => void;
  removeList: (boardId: string, listId: string) => void;
  updateList: (boardId: string, listId: string, updatedList: Partial<ListType>) => void;
  copyList: (boardId: string, listId: string) => void;

  addItem: (boardId: string, listId: string, item: ItemType) => void;
  copyItem: (boardId: string, listId: string, itemId: string) => void;
  removeItem: (boardId: string, listId: string, itemId: string) => void;
  updateItem: (boardId: string, listId: string, itemId: string, updatedItem: Partial<ItemType>) => void;

  currentBoardId: string;
  setCurrentBoardId: (currentBoardId: string) => void;

  currentBoardData: BoardType | null | undefined;
  setCurrentBoardData: (currentBoardData: BoardType) => void;

  setListColor: (listId: string, color: string) => void;
  setBoardColor: (boardId: string, color: string) => void;
};

export const useStore = create<StoreType>()(
  persist(
    (set) => ({
      boards: [],
      setBoards: (boards) => set({ boards }),

      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      removeBoard: (boardId) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          // set the currentboardId to the previous board id to thee one being deleted

          currentBoardId: state.boards?.at(-2)?.id,
        })),

      setBoardTitle: (boardId, name) => {
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, name } : board)),
        }));
      },

      updateBoard: (boardId, updatedBoard) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, ...updatedBoard } : board)),
        })),

      copyBoard: (boardId) =>
        set((state) => {
          const { boards } = state;
          const boardIndex = boards.findIndex((board) => board.id === boardId);
          if (boardIndex === -1) {
            return {}; // Not found
          }

          const boardToCopy = boards[boardIndex];
          const newBoard = { ...boardToCopy, id: uuidv4() };

          const updatedBoards = [...boards.slice(0, boardIndex + 1), newBoard, ...boards.slice(boardIndex + 1)];

          return { boards: updatedBoards };
        }),
      addList: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, lists: [...board.lists, { id: uuidv4(), title, items: [], order: board.lists.length + 1, color: "" }] } : board,
          ),
        })),

      removeList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, lists: board.lists.filter((list) => list.id !== listId) } : board)),
        })),

      copyList: (boardId, listId) =>
        set((state) => {
          const { boards } = state;

          console.log("boards", boards);

          const boardIndex = boards.findIndex((board) => board.id === boardId);
          const listIndex = boards[boardIndex]?.lists.findIndex((list) => list.id === listId);

          console.log("boardIndex", boardIndex);
          console.log("listIndex", listIndex);
          if (boardIndex === -1 || listIndex === -1) {
            return {}; // Not found
          }

          const listToCopy = boards[boardIndex].lists[listIndex];
          const newList = { ...listToCopy, id: uuidv4() };

          console.log("newList", newList);

          // change the listId of all items in the list
          const updatedItems = newList.items.map((item) => ({ ...item, id: uuidv4(), listId: newList.id }));

          newList.items = updatedItems;

          const updatedBoards = boards.map((board, bIndex) =>
            bIndex === boardIndex ? { ...board, lists: [...board.lists.slice(0, listIndex + 1), newList, ...board.lists.slice(listIndex + 1)] } : board,
          );

          return { boards: updatedBoards };
        }),

      updateList: (boardId, listId, updatedList) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, lists: board.lists.map((list) => (list.id === listId ? { ...list, ...updatedList } : list)) } : board,
          ),
        })),

      addItem: (boardId, listId, item) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) => (list.id === listId ? { ...list, items: [...list.items, item] } : list)),
                }
              : board,
          ),
        })),

      removeItem: (boardId, listId, itemId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) => (list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list)),
                }
              : board,
          ),
        })),
      copyItem: (boardId, listId, itemId) =>
        set((state) => {
          const { boards } = state;

          const boardIndex = boards.findIndex((board) => board.id === boardId);
          const listIndex = boards[boardIndex]?.lists.findIndex((list) => list.id === listId);
          const itemIndex = boards[boardIndex]?.lists[listIndex]?.items.findIndex((item) => item.id === itemId);

          if (boardIndex === -1 || listIndex === -1 || itemIndex === -1) {
            return {}; // Not found
          }

          const itemToCopy = boards[boardIndex].lists[listIndex].items[itemIndex];
          const newItem = { ...itemToCopy, id: uuidv4() };

          const updatedBoards = boards.map((board, bIndex) =>
            bIndex === boardIndex
              ? {
                  ...board,
                  lists: board.lists.map((list, lIndex) =>
                    lIndex === listIndex ? { ...list, items: [...list.items.slice(0, itemIndex + 1), newItem, ...list.items.slice(itemIndex + 1)] } : list,
                  ),
                }
              : board,
          );

          return { boards: updatedBoards };
        }),

      updateItem: (boardId, listId, itemId, updatedItem) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId ? { ...list, items: list.items.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item)) } : list,
                  ),
                }
              : board,
          ),
        })),

      setListColor: (listId, color) =>
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.map((list) => (list.id === listId ? { ...list, color } : list)),
          })),
        })),
      setBoardColor: (boardId, color) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, color } : board)),
        })),

      currentBoardId: "main",
      setCurrentBoardId: (currentBoardId: string) => set({ currentBoardId }),

      currentBoardData: null,
      setCurrentBoardData: (currentBoardData: BoardType) => set({ currentBoardData }),
    }),
    {
      name: "boardStore",
      storage: createJSONStorage(() => storage),
    },
  ),
);
