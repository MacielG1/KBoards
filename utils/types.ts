import { BoardType, ItemType, ListType } from "@/store/store";

export type BoardWithLists = BoardType & { lists: ListWithItems[] };

export type ListWithItems = ListType & { items: ItemType[] };
