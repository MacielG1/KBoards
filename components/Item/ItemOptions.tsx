"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ItemType, useStore } from "@/store/store";
import { Copy, Eraser, MoreHorizontal, Trash, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { deleteItem } from "@/utils/actions/items/deleteItem";
import { copyItem } from "@/utils/actions/items/copyItem";
import { useParams } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import ColorPicker from "../Form/ColorPicker";
import { updateItemColor } from "@/utils/actions/items/updateItemColor";

type ItemOptionsProps = {
  data: ItemType;
};

export default function ItemOptions({ data }: ItemOptionsProps) {
  const [itemColor, setItemColorState] = useState(data.color);

  const closeRef = useRef<ElementRef<"button">>(null);

  const removeItem = useStore((state) => state.removeItem);
  const copyItemState = useStore((state) => state.copyItem);
  const setItemColor = useStore((state) => state.setItemColor);

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
          <div className="flex-grow pl-2 text-center text-sm font-medium text-neutral-500">Item Options</div>
          <PopoverClose asChild>
            <Button ref={closeRef} className="mr-2 h-auto w-auto p-1 text-neutral-600 focus-visible:ring-neutral-600" variant="ghost">
              <X className="size-4" />
            </Button>
          </PopoverClose>
        </div>

        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4" /> Copy Item
        </Button>
        <Separator />
        <Button
          tabIndex={-1}
          onClick={(e) => {
            // e.stopPropagation();
          }}
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-0 px-4 text-sm font-normal"
        >
          <ColorPicker id={data.id} value={itemColor} type="item" setter={setItemColorState} />
          {itemColor !== "" && (
            <span
              className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-950 group-hover:opacity-100 dark:hover:text-neutral-300"
              onClick={(e) => {
                // e.stopPropagation();
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
          Delete Item
        </Button>
      </PopoverContent>
    </Popover>
  );
}
