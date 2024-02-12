"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ListType, useStore } from "@/store/store";
import { Copy, MoreHorizontal, Plus, Trash, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";

import ColorPicker from "../Form/ColorPicker";
import DeleteModal from "../Modals/DeleteModal";

type ListOptionsProps = {
  data: ListType;
  onAddCard: () => void;
  textColor: string;
};

export default function ListOptions({ data, onAddCard, textColor }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isHovered, setIsHovered] = useState(false);

  const removeList = useStore((state) => state.removeList);
  const currentBoardId = useStore((state) => state.currentBoardId);
  const copyList = useStore((state) => state.copyList);
  const setListColor = useStore((state) => state.setListColor);

  function handleDelete() {
    removeList(currentBoardId, data.id);
    closeRef.current?.click();
  }

  function handleCopy() {
    copyList(currentBoardId, data.id);
    closeRef.current?.click();
  }

  function handleColorReset() {
    setListColor(data.id, "", data.id);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            borderColor: isHovered ? textColor : "transparent",
          }}
          className="h-auto w-auto border p-1 transition-all duration-300 hover:bg-transparent dark:hover:bg-transparent"
          variant="ghost"
        >
          <MoreHorizontal style={{ color: textColor }} className="size-4 " />
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
          <Plus className="mr-2 size-4" /> Add Card
        </Button>
        <Separator />
        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4" /> Copy List
        </Button>

        <Separator />
        <Button
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-1 px-4 pl-[1.1rem] text-sm font-normal"
        >
          <ColorPicker id={data.id} value={data.color} type="list" />
          <span
            className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-800 group-hover:opacity-100 dark:hover:text-neutral-300"
            onClick={handleColorReset}
          >
            Reset
          </span>
        </Button>
        <Separator />

        <DeleteModal message={`Delete List: ${data.title}`} deleteHandler={handleDelete}>
          <Button variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
            <Trash className="mr-2 size-4" /> Delete List
          </Button>
        </DeleteModal>
      </PopoverContent>
    </Popover>
  );
}
