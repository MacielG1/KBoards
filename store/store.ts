import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

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
  boardId: string;
  color: string;
};

export type BoardType = {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  lists?: ListType[];
  order: number;
  isCurrentBoard?: boolean;
};

export type StoreType = {
  orderedBoards: BoardType[];
  setOrderedBoards: (boards: BoardType[]) => void;

  updateCurrentBoardTitle: (title: string, boardId: string) => void;

  addBoard: (board: BoardType) => void;
  removeBoard: (boardId: string) => void;
  updateBoard: (boardId: string, updatedBoard: Partial<BoardType>) => void;
  copyBoard: (boardId: string, newId: string) => void;

  setBoardTitle: (boardId: string, title: string) => void;

  setBoardColor: (boardId: string, color: string) => void;
  setBoardBackgroundColor: (boardId: string, color: string) => void;

  lists: ListType[];
  setLists: (list: ListType[], boardId: string) => void;

  addList: (list: ListType) => void;
  removeList: (listId: string, boardId: string) => void;
  updateList: (listId: string, updatedList: Partial<ListType>, boardId: string) => void;
  copyList: (listId: string, newId: string) => void;
  setListColor: (listId: string, color: string, boardId: string) => void;
  moveList: (listId: string, boardId: string) => void;

  addItem: (item: ItemType, listId: string) => void;
  removeItem: (itemId: string, listId: string) => void;
  updateItem: (itemId: string, updatedItem: Partial<ItemType>, listId: string) => void;
  setItemColor: (itemId: string, color: string, boardId: string) => void;
  insertItem: (item: ItemType, position: "above" | "below", itemId: string, newId: string) => void;

  copyItem: (itemId: string, listId: string, newId: string, boardId: string) => void;
};

export const useStore = create<StoreType>((set, get) => ({
  orderedBoards: [],
  setOrderedBoards: (boards) => set({ orderedBoards: boards }),

  updateCurrentBoardTitle: (title: string, boardId: string) =>
    set((state) => ({ orderedBoards: state.orderedBoards.map((board) => (board.id === boardId ? { ...board, name: title } : board)) })),

  addBoard: (board: BoardType) => set((state) => ({ orderedBoards: [...state.orderedBoards, board] })),

  removeBoard: (boardId: string) =>
    set((state) => {
      const updatedBoards = state.orderedBoards.filter((board) => board.id !== boardId);
      return {
        orderedBoards: updatedBoards,
      };
    }),

  setBoardTitle: (boardId: string, title: string) =>
    set((state) => ({ orderedBoards: state.orderedBoards.map((board) => (board.id === boardId ? { ...board, name: title } : board)) })),

  updateBoard: (boardId: string, updatedBoard: Partial<BoardType>) =>
    set((state) => ({ orderedBoards: state.orderedBoards.map((board) => (board.id === boardId ? { ...board, ...updatedBoard } : board)) })),

  setBoardColor: (boardId: string, color: string) =>
    set((state) => ({ orderedBoards: state.orderedBoards.map((board) => (board.id === boardId ? { ...board, color } : board)) })),

  copyBoard: (boardId: string, newId: string) => {
    const { orderedBoards } = get();
    const boardIndex = orderedBoards.findIndex((board) => board.id === boardId);

    if (boardIndex !== -1) {
      const boardToCopy = orderedBoards[boardIndex];
      const copiedBoard = { ...boardToCopy, id: newId, name: `${boardToCopy.name} (copy)` };
      set({ orderedBoards: [...orderedBoards.slice(0, boardIndex + 1), copiedBoard, ...orderedBoards.slice(boardIndex + 1)] });
    }
  },

  setBoardBackgroundColor: (boardId: string, backgroundColor: string) =>
    set((state) => ({ orderedBoards: state.orderedBoards.map((board) => (board.id === boardId ? { ...board, backgroundColor } : board)) })),

  lists: [],
  setLists: (lists, boardId) => set({ lists: lists.filter((list) => list.boardId === boardId) }),

  addList: (list) => set((state) => ({ lists: [...state.lists, list] })),

  removeList: (listId, boardId) => set((state) => ({ lists: state.lists.filter((list) => list.id !== listId && list.boardId === boardId) })),

  updateList: (listId, updatedList, boardId) =>
    set((state) => ({
      lists: state.lists.map((list) => (list.id === listId && list.boardId === boardId ? { ...list, ...updatedList } : list)),
    })),

  setListColor: (listId, color, boardId) =>
    set((state) => ({ lists: state.lists.map((list) => (list.id === listId && list.boardId === boardId ? { ...list, color } : list)) })),

  copyList: (listId, newId) => {
    const { lists } = get();
    const listIndex = lists.findIndex((list) => list.id === listId);

    if (listIndex !== -1) {
      const listToCopy = lists[listIndex];
      const copiedList = { ...listToCopy, id: newId, title: `${listToCopy.title} (copy)` };
      set({ lists: [...lists.slice(0, listIndex + 1), copiedList, ...lists.slice(listIndex + 1)] });
    }
  },
  moveList: (listId, boardId) => {
    const { lists } = get();
    const listIndex = lists.findIndex((list) => list.id === listId);

    if (listIndex !== -1) {
      set({ lists: [...lists.slice(0, listIndex), ...lists.slice(listIndex + 1)] });
    }
  },

  addItem: (item, listId) => set((state) => ({ lists: state.lists.map((list) => (list.id === listId ? { ...list, items: [...list.items, item] } : list)) })),
  removeItem: (itemId, listId) =>
    set((state) => ({
      lists: state.lists.map((list) => (list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list)),
    })),
  updateItem: (itemId, updatedItem, listId) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, items: list.items.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item)) } : list,
      ),
    })),
  setItemColor: (itemId, color, boardId) => {
    const { lists } = get();
    const listIndex = lists.findIndex((list) => list.boardId === boardId && list.items.some((item) => item.id === itemId));

    if (listIndex !== -1) {
      const list = lists[listIndex];
      const itemIndex = list.items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        const item = list.items[itemIndex];
        const updatedItem = { ...item, color };

        set({
          lists: [
            ...lists.slice(0, listIndex),
            { ...list, items: [...list.items.slice(0, itemIndex), updatedItem, ...list.items.slice(itemIndex + 1)] },
            ...lists.slice(listIndex + 1),
          ],
        });
      }
    }
  },

  copyItem: (boardId, listId, itemId, newId) =>
    set((state) => {
      const { lists } = state;
      const listIndex = lists.findIndex((list) => list.id === listId && list.boardId === boardId);

      if (listIndex !== -1) {
        const list = lists[listIndex];
        const itemIndex = list.items.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          const itemToCopy = list.items[itemIndex];
          const copiedItem = { ...itemToCopy, id: newId, content: `${itemToCopy.content}` };

          return {
            lists: [
              ...lists.slice(0, listIndex),
              { ...list, items: [...list.items.slice(0, itemIndex + 1), copiedItem, ...list.items.slice(itemIndex + 1)] },
              ...lists.slice(listIndex + 1),
            ],
          };
        }
      }
      return state;
    }),

  // insertItem: (item, position, itemId, newId) =>
  //   set((state) => {
  //     const { lists } = state;
  //     const listIndex = lists.findIndex((list) => list.items.some((item) => item.id === itemId));

  //     if (listIndex !== -1) {
  //       const list = lists[listIndex];
  //       const itemIndex = list.items.findIndex((item) => item.id === itemId);

  //       if (itemIndex !== -1) {
  //         // update order of items and  change order of the item
  //         const updatedItems = list.items.map((existingItem) => {
  //           if (position === "above") {
  //             return existingItem.order >= itemIndex ? { ...existingItem, order: existingItem.order + 1 } : existingItem;
  //           } else {
  //             // When inserting below, increment the order of items that come after the new item's position
  //             return existingItem.order > itemIndex ? { ...existingItem, order: existingItem.order + 1 } : existingItem;
  //           }
  //         });
  //         const newItem = { ...item, order: position === "above" ? itemIndex : itemIndex + 1 };

  //         if (position === "above") {
  //           updatedItems.splice(itemIndex, 0, newItem);
  //         } else {
  //           updatedItems.splice(itemIndex + 1, 0, newItem);
  //         }

  //         return {
  //           lists: [...lists.slice(0, listIndex), { ...list, items: updatedItems }, ...lists.slice(listIndex + 1)],
  //         };
  //       }
  //     }
  //     return state;
  //   }),
  insertItem: (item, position, itemId, newId) =>
    set((state) => {
      const { lists } = state;
      const listIndex = lists.findIndex((list) => list.items.some((item) => item.id === itemId));

      if (listIndex !== -1) {
        const list = lists[listIndex];
        const itemIndex = list.items.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          const updatedItems = list.items.map((existingItem, index) => {
            if ((position === "above" && index >= itemIndex) || (position !== "above" && index > itemIndex)) {
              return { ...existingItem, order: existingItem.order + 1 };
            } else {
              return existingItem;
            }
          });

          const newItemOrder = position === "above" ? itemIndex : itemIndex + 1;
          const newItem = { ...item, order: newItemOrder };

          updatedItems.splice(newItemOrder, 0, newItem);

          lists[listIndex] = { ...list, items: updatedItems };

          return { ...state, lists };
        }
      }
      return state;
    }),
}));

export type StoreTypePersisted = {
  currentBoardId: string | null;
  setCurrentBoardId: (currentBoardId: string | null) => void;

  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;

  showItemsOrder: boolean;
  toggleItemsOrder: () => void;

  textAlignment: "left" | "center" | "right";
  setTextAlignment: (textAlignment: "left" | "center" | "right") => void;
};

export const useStorePersisted = create<StoreTypePersisted>()(
  persist(
    (set) => ({
      currentBoardId: null,
      setCurrentBoardId: (currentBoardId) => set({ currentBoardId }),

      isCollapsed: false,
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),

      showItemsOrder: false,
      toggleItemsOrder: () => set((state) => ({ showItemsOrder: !state.showItemsOrder })),

      textAlignment: "left",
      setTextAlignment: (textAlignment) => set({ textAlignment }),
    }),

    {
      name: "boardStore",
      storage: createJSONStorage(() => storage),
    },
  ),
);
