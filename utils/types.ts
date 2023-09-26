export type ListType = {
  id: string;
  title: string;
  boardId: string;
  items: ItemType[];
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
  items: ItemType[];
  setItems: (listItems: ItemType[]) => void;
  addItem: (item: ItemType) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, content: string) => void;
  lists: ListType[];
  setLists: (lists: ListType[]) => void;
  addList: (list: ListType) => void;
  deleteList: (id: string) => void;
  updateList: (id: string, title: string) => void;

  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;
  addBoard: (board: BoardType) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, title: string) => void;
  currentBoardId: string;
  setCurrentBoardId: (currentBoardId: string) => void;
};
