"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ItemType, useStore } from "@/store/store";
import { Copy, Eraser, ListEnd, ListStart, MoreHorizontal, Trash, X } from "lucide-react";
import { useRef, useState } from "react";
import { deleteItem } from "@/utils/actions/items/deleteItem";
import { copyItem } from "@/utils/actions/items/copyItem";
import { createItem } from "@/utils/actions/items/createItem";
import { useParams } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import ColorPicker from "../Form/ColorPicker";
import { updateItemColor } from "@/utils/actions/items/updateItemColor";
import { insertItem } from "@/utils/actions/items/insertItem";
import { useShallow } from "zustand/shallow";

type ItemOptionsProps = {
  data: ItemType;
};

export default function ItemOptions({ data }: ItemOptionsProps) {
  const [itemColor, setItemColorState] = useState(data.color);

  const closeRef = useRef<HTMLButtonElement>(null);

  const removeItem = useStore(useShallow((state) => state.removeItem));
  const copyItemState = useStore(useShallow((state) => state.copyItem));
  const setItemColor = useStore(useShallow((state) => state.setItemColor));
  const addItem = useStore(useShallow((state) => state.addItem));
  const insertItemState = useStore(useShallow((state) => state.insertItem));

  const params = useParams<{ boardId: string }>();

  async function handleDelete() {
    removeItem(data.id, data.listId);
    closeRef.current?.click();

    await deleteItem(data);
  }

  async function handleCopy() {
    const newId = createId();
    copyItemState(params.boardId, data.listId, data.id, newId);
    closeRef.current?.click();
    await copyItem({ id: data.id, listId: data.listId, boardId: params.boardId, newId, color: data.color });
  }

  async function handleColorReset() {
    setItemColorState("");
    setItemColor(data.id, "", params.boardId);
    await updateItemColor({ id: data.id, color: "", boardId: params.boardId });
  }

  async function InsertItemAbove() {
    const newItem = {
      id: createId(),
      content: "",
      listId: data.listId,
      order: data.order,
      boardId: params.boardId,
      color: "",
    };

    insertItemState(newItem, "above", data.id, newItem.id);
    closeRef.current?.click();

    await insertItem(newItem, "above");
  }

  async function InsertItemBelow() {
    const newItem = {
      id: createId(),
      content: "",
      listId: data.listId,
      order: data.order,
      boardId: params.boardId,
      color: "",
    };

    insertItemState(newItem, "below", data.id, newItem.id);
    closeRef.current?.click();

    await insertItem(newItem, "below");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto border border-neutral-900 bg-neutral-200 p-[0.1rem] text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
          variant="ghost"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 px-0 pb-2 pt-3" side="bottom" align="start">
        <div className="flex items-center pb-2">
          <div className="grow pl-2 text-center text-sm font-medium text-neutral-500">Item Options</div>
          <PopoverClose asChild>
            <Button ref={closeRef} className="mr-2 h-auto w-auto p-1 text-neutral-600 focus-visible:ring-neutral-600" variant="ghost">
              <X className="size-4 shrink-0" />
            </Button>
          </PopoverClose>
        </div>
        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4 shrink-0" /> <span className="pb-[1px]">Copy Item</span>
        </Button>
        <Separator />
        <Button onClick={InsertItemAbove} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <ListStart className="mr-2 size-4 shrink-0" /> <span className="pb-[1px]">Insert Item Above</span>
        </Button>
        <Separator />
        <Button onClick={InsertItemBelow} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <ListEnd className="mr-2 size-4 shrink-0" /> <span className="pb-[1px]">Insert Item Below</span>
        </Button>
        <Separator />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById(`item-${data.id}`)?.click();
          }}
          variant="ghost"
          className="group h-auto w-full justify-start rounded-none p-2 px-5 pl-4 text-sm font-normal"
        >
          <ColorPicker id={data.id} value={itemColor} type="item" setter={setItemColorState} className="mr-2" />
          {itemColor !== "" && (
            <span
              className="ml-auto cursor-pointer text-sm text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-300"
              onClick={(e) => {
                e.stopPropagation();
                handleColorReset();
              }}
            >
              <Eraser className="ml-2 size-4 shrink-0" />
            </span>
          )}
        </Button>
        <Separator />
        <Button onClick={handleDelete} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Trash className="mr-2 size-4" />
          <span className="pb-[1px]">Delete Item</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
