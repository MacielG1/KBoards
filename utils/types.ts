export type ListType = {
  id: string;
  title: string;
};

export type ItemType = {
  id: string;
  listId: string;
  content: string;
};

export type BoardType = {
  id: string;
  title: string;
  lists: ListType[];
};

export type StoreType = {
  listItems: ItemType[];
  setListItems: (listItems: ItemType[]) => void;
  addListItem: (item: ItemType) => void;
  deleteListItem: (id: string) => void;
  updateListItem: (id: string, content: string) => void;
  lists: ListType[];
  setLists: (lists: ListType[]) => void;
  addList: (list: ListType) => void;
  deleteList: (id: string) => void;
  updateList: (id: string, title: string) => void;

  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;
  currentBoardId: string;
  setCurrentBoardId: (currentBoardId: string) => void;
};
