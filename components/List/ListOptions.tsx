"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ListType, useStore } from "@/store/store";

import { Copy, MoreHorizontal, Plus, Trash, X } from "lucide-react";
import { ElementRef, useCallback, useRef } from "react";
import FormButton from "../Form/FormButton";
import Chrome from "@uiw/react-color-chrome";
import ColorPicker from "../Form/ColorPicker";

type ListOptionsProps = {
  data: ListType;
  onAddCard: () => void;
};

export default function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const removeList = useStore((state) => state.removeList);
  const currentBoardId = useStore((state) => state.currentBoardId);
  const copyList = useStore((state) => state.copyList);
  const setColor = useStore((state) => state.setColor); // takes a listId and a color

  function handleDelete() {
    removeList(currentBoardId, data.id);
    closeRef.current?.click();
  }

  function handleCopy() {
    copyList(currentBoardId, data.id);
    closeRef.current?.click();
  }

  function handleColorReset() {
    const defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--list-default");
    setColor(data.id, defaultColor);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=" h-auto w-auto p-1 hover:bg-neutral-400 dark:hover:bg-neutral-700" variant="ghost">
          <MoreHorizontal className="size-4 text-neutral-700 dark:text-neutral-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-neutral-500">List Options</div>
        <PopoverClose asChild ref={closeRef}>
          <Button className="absolute right-2 top-2  h-auto w-auto p-2 text-neutral-600 focus-visible:ring-neutral-700" variant="ghost">
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <Button onClick={onAddCard} className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal" variant="ghost">
          <Plus className="mr-2 size-4" /> Add card
        </Button>
        <Separator />
        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4" /> Copy list
        </Button>

        <Separator />
        <Button
          onClick={handleColorReset}
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-1 px-4 pl-[1.1rem] text-sm font-normal"
        >
          <ColorPicker listId={data.id} value={data.color} />
          <span
            className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-300 group-hover:opacity-100"
            onClick={handleColorReset}
          >
            Reset
          </span>
        </Button>
        <Separator />
        <Button onClick={handleDelete} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Trash className="mr-2 size-4" /> Delete list
        </Button>
      </PopoverContent>
    </Popover>
  );
}
