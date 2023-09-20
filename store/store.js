import { create } from 'zustand';

export const useStore = create((set) => ({
  value: '',
  setValue: (value) => set({ value }),
  items: [],
  setItems: (items) => set({ items }),
}));
