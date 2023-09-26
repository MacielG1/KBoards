import { BoardType, ItemType, ListType, StoreType } from "@/utils/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
const defaultLists: ListType[] = [
  {
    id: uuidv4(),
    title: "Todo",
  },
  {
    id: uuidv4(),
    title: "Finished",
  },
];

export const useStore = create<StoreType>((set) => ({
  listItems: [],
  setListItems: (listItems: ItemType[]) => set({ listItems }),
  addListItem: (item: ItemType) => set((state) => ({ listItems: [...state.listItems, item] })),
  deleteListItem: (id: string) => set((state) => ({ listItems: state.listItems.filter((item) => item.id !== id) })),
  updateListItem: (id: string, content: string) => set((state) => ({ listItems: state.listItems.map((item) => (item.id === id ? { ...item, content } : item)) })),
  lists: defaultLists,
  setLists: (lists: ListType[]) => set({ lists }),
  addList: (list: ListType) => set((state) => ({ lists: [...state.lists, list] })),
  deleteList: (id: string) => set((state) => ({ lists: state.lists.filter((list) => list.id !== id) })),
  updateList: (id: string, title: string) => set((state) => ({ lists: state.lists.map((list) => (list.id === id ? { ...list, title } : list)) })),
  boards: [],
  setBoards: (boards: BoardType[]) => set({ boards }),
  addBoard: (board: BoardType) => set((state) => ({ boards: [...state.boards, board] })),
  deleteBoard: (id: string) => set((state) => ({ boards: state.boards.filter((board) => board.id !== id) })),
  updateBoard: (id: string, title: string) => set((state) => ({ boards: state.boards.map((board) => (board.id === id ? { ...board, title } : board)) })),
  currentBoardId: "",
  setCurrentBoardId: (currentBoardId: string) => set({ currentBoardId }),
}));
