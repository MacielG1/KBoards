import { BoardType, ItemType, ListType, StoreType } from "@/utils/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
const defaultLists: ListType[] = [
  {
    id: uuidv4(),
    title: "Todo",
    items: [],
  },
  {
    id: uuidv4(),
    title: "Finished",
    items: [],
  },
];

const defaultBoards: BoardType[] = [
  {
    id: "main",
    title: "Main",
    lists: defaultLists,
  },
];
export const useStore = create<StoreType>((set) => ({
  items: [],
  setItems: (items: ItemType[]) => set({ items: items }),
  addItem: (item: ItemType) => set((state) => ({ items: [...state.items, item] })),
  deleteItem: (id: string) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  updateItem: (id: string, content: string) => set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, content } : item)) })),
  lists: defaultLists,
  setLists: (lists: ListType[]) => set({ lists }),
  addList: (list: ListType) => set((state) => ({ lists: [...state.lists, list] })),
  deleteList: (id: string) => set((state) => ({ lists: state.lists.filter((list) => list.id !== id) })),
  updateList: (id: string, title: string) => set((state) => ({ lists: state.lists.map((list) => (list.id === id ? { ...list, title } : list)) })),
  boards: defaultBoards,
  setBoards: (boards: BoardType[]) => set({ boards }),
  addBoard: (board: BoardType) => set((state) => ({ boards: [...state.boards, board] })),
  deleteBoard: (id: string) => set((state) => ({ boards: state.boards.filter((board) => board.id !== id) })),
  updateBoard: (id: string, title: string) => set((state) => ({ boards: state.boards.map((board) => (board.id === id ? { ...board, title } : board)) })),
  currentBoardId: "",
  setCurrentBoardId: (currentBoardId: string) => set({ currentBoardId }),
}));
