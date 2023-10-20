import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { ListType, ItemType } from "@/utils/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

import { Icons } from "@/assets/Icons";
import Button from "../Button";
import Item from "../ItemCard";

interface Props {
  list: ListType;
  items: ItemType[];

  updateItem: (id: string, content: string) => void;
  deleteItem: (id: string) => void;
}

export default function List({ list, items, deleteItem, updateItem }: Props) {
  const itemsIds = useMemo(() => {
    return items.map((item) => item.id);
  }, [items]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // if (isDragging) {
  //   return <div ref={setNodeRef} className="bg-red-800 opacity-40  h-[80vh] rounded-xl flex flex-col w-[22rem]" />;
  // }

  return (
    <div ref={setNodeRef} style={style} className="bg-neutral-800 w-[20rem] border border-neutral-900 h-[80vh] rounded-xl flex flex-col">
      <div
        {...attributes}
        {...listeners}
        className="bg-neutral-900 text-neutral-100 text-lg h-[4rem] rounded-xl rounded-b-none p-3 font-bold flex items-center justify-between"
      >
        <div className="flex gap-2 items-center ">
          <div className="flex justify-center items-center bg-neutral-800 w-8 h-8 rounded-full">{itemsIds.length}</div>

          <span className="flex-grow text-center">{list.title}</span>
        </div>
        <button>
          <Icons.trashIcon className="w-5 h-5 text-neutral-600 hover:text-red-500 transition duration-300" />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {/* <SortableContext items={itemsIds}> */}
        {items.map((item) => (
          <Item key={item.id} Item={item} deleteItem={deleteItem} updateItem={updateItem} />
        ))}
        {/* </SortableContext> */}
      </div>

      <Button className="flex gap-2 items-center rounded-t-none justify-center dark:bg-neutral-900 p-4 w-full dark:hover:bg-indigo-900 active:bg-black transition duration-300">
        <Icons.plusIcon className="w-4 h-4 text-neutral-400 " />
        Add Item
      </Button>
    </div>
  );
}
