import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { ListType, ItemType } from "@/utils/types";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useRef, useState } from "react";

import Button from "./Button";

import { Icons } from "@/assets/Icons";
import ItemCard from "./ItemCard";
import NewItem from "./NewItem";
import { useStore } from "@/store/store";
import { useIsMounted } from "@/hooks/useIsMounted";
import { v4 as uuidv4 } from "uuid";

interface Props {
  list: ListType;
  items: ItemType[];
  deleteList: (id: string) => void;
  updateList: (id: string, title: string) => void;
}

export default function ListOverlay({ list, deleteList, updateList, items }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useIsMounted();
  const [currentListId, setCurrentListId] = useStore((state) => [state.currentListId, state.setCurrentListId]);

  const [lists, setLists] = useStore((state) => [state.lists, state.setLists]);
  const [listItems, setListItems] = useStore((state) => [state.items, state.setItems]);

  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);

  const itemsIds = useMemo(() => {
    return items.map((item) => item.id);
  }, [items]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
    disabled: isEditing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function addItem(listId: string, content: string) {
    const newItem: ItemType = {
      id: uuidv4(),
      listId,
      content,
    };
    // addItem(newItem);
    setListItems([...listItems, newItem]);

    localStorage.setItem(`board-${currentBoardId}`, JSON.stringify({ lists: lists, items: [...listItems, newItem] }));
  }

  function deleteItem(id: string) {
    // deleteItem(id);
    setListItems(listItems.filter((i) => i.id !== id));

    localStorage.setItem(`board-${currentBoardId}`, JSON.stringify({ lists: lists, items: listItems.filter((i) => i.id !== id) }));
  }

  function updateItem(id: string, content: string) {
    // updateItem(id, content);
    setListItems(listItems.map((i) => (i.id === id ? { ...i, content } : i)));
    localStorage.setItem(`board-${currentBoardId}`, JSON.stringify({ lists: lists, items: listItems }));
  }

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen && isMounted() && listRef.current && list.id === currentListId) {
      // scroll to the bottom when adding a new item
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [isModalOpen, addItem]);

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="bg-neutral-800 opacity-40  h-[80vh] rounded-xl flex flex-col w-[20rem]" />;
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-neutral-800 w-[20rem] h-[80vh] rounded-xl flex flex-col  ">
      <div
        {...attributes}
        {...listeners}
        className="bg-neutral-900 min-h-[4rem] h-[4rem]  text-neutral-100 text-lg  rounded-xl rounded-b-none  font-bold flex items-center justify-between"
      >
        <div className="flex gap-2 items-center w-[90%] cursor-text px-2">
          <span className="flex justify-center items-center bg-neutral-800 w-8 h-8 rounded-full">{itemsIds.length}</span>
          <p
            className="flex-grow rounded-md h-8 flex items-center "
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {!isEditing ? (
              <span className="w-full">{list.title}</span>
            ) : (
              <input
                className="bg-black w-full h-8 focus:border-neutral-500 border rounded-md outline-none px-2 "
                value={list.title}
                onChange={(e) => updateList(list.id, e.target.value)}
                onBlur={(e) => {
                  e.stopPropagation();
                  setIsEditing((prev) => !prev);
                }}
                autoFocus
                maxLength={25}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setIsEditing(false);
                }}
              />
            )}
          </p>
        </div>
        <span className="h-full w-[10%]  flex justify-center items-center cursor-default">
          <Icons.trashIcon
            onClick={() => {
              deleteList(list.id);
            }}
            className="w-5 h-5 text-neutral-600 hover:text-red-500 transition duration-300 cursor-pointer"
          />
        </span>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto" ref={listRef}>
        <SortableContext items={itemsIds} strategy={() => null}>
          {items.map((item) => (
            <ItemCard key={item.id} Item={item} deleteItem={deleteItem} updateItem={updateItem} />
          ))}
        </SortableContext>
      </div>

      {isModalOpen ? (
        <NewItem listId={list.id} addItem={addItem} onChange={updateItem} closeModal={() => setIsModalOpen(false)} />
      ) : (
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setCurrentListId(list.id);
          }}
          className="mt-[0.15rem] flex gap-2 items-center border-0 ring-1 ring-neutral-700 ring-inset rounded-t-md justify-start dark:bg-neutral-900 p-4 w-full dark:hover:bg-black active:bg-black transition duration-300"
        >
          <Icons.plusIcon className="w-4 h-4 text-neutral-400 " />
          Add Item
        </Button>
      )}
    </div>
  );
}
