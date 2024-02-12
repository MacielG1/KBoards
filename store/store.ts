import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export const defaultBoards: BoardType[] = [
  {
    id: "main",
    name: "Main",
    color: "#000000",
    backgroundColor: "#000000",
    order: 1,
    lists: [
      {
        id: "list-1",
        title: "List 1",
        color: "#ff0000",
        order: 1,
        boardId: "main",
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
    ],
  },
];

export type ListType = {
  id: string;
  title: string;
  items: ItemType[];
  color: string;
  order: number;
  boardId: string;
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
  backgroundColor: string;
  lists: ListType[];
  order: number;
};

export type StoreType = {
  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;

  addBoard: (board: BoardType) => void;
  removeBoard: (boardId: string) => void;
  copyBoard: (boardId: string) => void;

  setBoardTitle: (boardId: string, name: string) => void;
  updateBoard: (boardId: string, updatedBoard: Partial<BoardType>) => void;

  addList: (boardId: string, list: ListType) => void;
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
  setCurrentBoardData: (currentBoardData: BoardType | null) => void;

  setListColor: (listId: string, color: string, boardId: string) => void;
  setBoardColor: (boardId: string, color: string) => void;
  setBoardBackgroundColor: (boardId: string, backgroundColor: string) => void;

  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};

export const useStore = create<StoreType>()(
  persist(
    (set) => ({
      boards: [],
      setBoards: (boards) => set({ boards }),

      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      removeBoard: (boardId) =>
        set((state) => {
          const updatedBoards = state.boards.filter((board) => board.id !== boardId);
          const currentBoardId = state.currentBoardId === boardId ? updatedBoards?.at(-1)?.id : state.currentBoardId;

          return {
            boards: updatedBoards,
            currentBoardId,
          };
        }),

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

          const newBoardId = uuidv4();
          const newBoard = { ...boardToCopy, id: newBoardId, name: `${boardToCopy.name} - copy` };

          // change the boardId of each list
          const updatedLists = newBoard.lists.map((list) => ({ ...list, id: uuidv4() }));

          newBoard.lists = updatedLists;

          // change the listId of all items in the list
          const updatedItems = newBoard.lists.map((list) => list.items.map((item) => ({ ...item, id: uuidv4(), listId: list.id })));

          newBoard.lists = newBoard.lists.map((list, index) => ({ ...list, items: updatedItems[index] }));

          const updatedBoards = [...boards.slice(0, boardIndex + 1), newBoard, ...boards.slice(boardIndex + 1)];

          return { boards: updatedBoards, currentBoardId: newBoardId };
        }),
      // addList: (boardId, title) =>
      //   set((state) => ({
      //     boards: state.boards.map((board) =>
      //       board.id === boardId
      //         ? { ...board, lists: [...board.lists, { id: uuidv4(), title, items: [], order: board.lists.length + 1, color: "", boardId }] }
      //         : board,
      //     ),
      //   })),
      addList: (boardId, newList) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, lists: [...board.lists, newList] } : board)),
        })),

      removeList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, lists: board.lists.filter((list) => list.id !== listId) } : board)),
        })),

      copyList: (boardId, listId) =>
        set((state) => {
          const { boards } = state;

          const boardIndex = boards.findIndex((board) => board.id === boardId);
          const listIndex = boards[boardIndex]?.lists.findIndex((list) => list.id === listId);

          if (boardIndex === -1 || listIndex === -1) {
            return {}; // Not found
          }

          const listToCopy = boards[boardIndex].lists[listIndex];
          const newList = { ...listToCopy, id: uuidv4(), title: `${listToCopy.title} - copy` };

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
          const newItem = { ...itemToCopy, id: uuidv4(), content: `${itemToCopy.content} - copy` };

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

      setListColor: (listId, color, boardId) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            return {
              ...board,
              lists: board.lists.map((list) => (list.id === listId ? { ...list, color } : list)),
            };
          }),
        })),
      setBoardColor: (boardId, color) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, color } : board)),
        })),

      setBoardBackgroundColor: (boardId, backgroundColor) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === boardId ? { ...board, backgroundColor } : board)),
        })),

      currentBoardId: "main",
      setCurrentBoardId: (currentBoardId: string) => set({ currentBoardId }),

      currentBoardData: null,
      setCurrentBoardData: (currentBoardData: BoardType | null) => set({ currentBoardData }),

      isCollapsed: false,
      setIsCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
    }),
    {
      name: "boardStore",
      storage: createJSONStorage(() => storage),
    },
  ),
);
