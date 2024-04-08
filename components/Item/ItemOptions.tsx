"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ItemType, useStore } from "@/store/store";
import { Copy, MoreHorizontal, Trash, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { deleteItem } from "@/utils/actions/items/deleteItem";
import { copyItem } from "@/utils/actions/items/copyItem";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type ItemOptionsProps = {
  data: ItemType;
};

export default function ItemOptions({ data }: ItemOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const removeItem = useStore((state) => state.removeItem);
  // const currentBoardId = useStore((state) => state.currentBoardId);
  const copyItemState = useStore((state) => state.copyItem);

  const params = useParams<{ boardId: string }>();

  async function handleDelete() {
    removeItem(data.id, data.listId);
    closeRef.current?.click();

    await deleteItem(data);
  }

  async function handleCopy() {
    const newId = uuidv4();
    copyItemState(params.boardId, data.listId, data.id, newId);
    closeRef.current?.click();
    await copyItem({ id: data.id, listId: data.listId, boardId: params.boardId, newId });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-[0.1rem] hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600" variant="ghost">
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
        <Button onClick={handleDelete} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Trash className="mr-2 size-4" />
          Delete Item
        </Button>
      </PopoverContent>
    </Popover>
  );
}
