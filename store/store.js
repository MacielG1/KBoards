import { create } from 'zustand';

export const useStore = create((set) => ({
  item: {},
  setItem: (item) => set({ item }),
  items: [],
  setItems: (items) => set({ items }),
  getItems: () => {
    return get().items;
  },
}));
