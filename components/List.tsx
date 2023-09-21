import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { ListType, ItemType } from "@/utils/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

import Button from "./Button";

interface Props {
  list: ListType;
  items: ItemType[];
  deleteList: (id: string) => void;
  updateList: (id: string, title: string) => void;

  addItem: (listId: string) => void;
  updateItem: (id: string, content: string) => void;
  deleteItem: (id: string) => void;
}

export default function List({ list, deleteList, updateList, addItem, items, deleteItem, updateItem }: Props) {
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div ref={setNodeRef} style={style} className="bg-neutral-800 w-[22rem] min-h-[25vh] max-h-[88vh] rounded-xl flex flex-col">
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setIsEditing(true);
        }}
        className="bg-neutral-900 text-neutral-100 text-lg h-[4rem] rounded-xl rounded-b-none p-3 font-bold flex items-center justify-between"
      >
        <div className="flex gap-2 items-center ">
          <div className="flex justify-center items-center bg-neutral-800 w-8 h-8 rounded-full">{itemsIds.length}</div>
          {!isEditing ? (
            <span className="flex-grow text-center">{list.title}</span>
          ) : (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2 "
              value={list.title}
              onChange={(e) => updateList(list.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setIsEditing(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteList(list.id);
          }}
        >
          X
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={itemsIds}>
          {items.map((item) => (
            <>{item.content}</>
          ))}
        </SortableContext>
      </div>

      <Button
        className="flex gap-2 items-center rounded-t-none justify-center dark:bg-neutral-900 p-4 w-full dark:hover:bg-indigo-900 active:bg-black transition duration-300"
        onClick={() => {
          addItem(list.id);
        }}
      >
        + Add Item
      </Button>
    </div>
  );
}
