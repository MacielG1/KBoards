"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BoardType, ListType, useStore } from "@/store/store";

import { Copy, MoreHorizontal, Pencil, Plus, Trash, X } from "lucide-react";
import { ElementRef, useCallback, useRef } from "react";
import FormButton from "../Form/FormButton";
import Chrome from "@uiw/react-color-chrome";
import ColorPicker from "../Form/ColorPicker";
import DeleteModal from "../Modals/DeleteModal";

type BoardOptionsProps = {
  data: BoardType;
  enableEditing: () => void;
};

export default function BoardOptions({ data, enableEditing }: BoardOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const removeBoard = useStore((state) => state.removeBoard);
  const copyBoard = useStore((state) => state.copyBoard);
  const setBoardColor = useStore((state) => state.setBoardColor); // takes a listId and a color

  function handleDelete() {
    removeBoard(data.id);
    closeRef.current?.click();
  }

  function handleCopy() {
    copyBoard(data.id);
    closeRef.current?.click();
  }
  function handleColorReset() {
    const defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--board-default");
    setBoardColor(data.id, defaultColor);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=" h-auto w-auto p-1 hover:bg-neutral-400 dark:hover:bg-neutral-700" variant="ghost">
          <MoreHorizontal className="size-4 text-neutral-700 dark:text-neutral-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-neutral-500">Board Options</div>
        <PopoverClose asChild ref={closeRef}>
          <Button className="absolute right-2 top-2  h-auto w-auto p-2 text-neutral-600 focus-visible:ring-neutral-700" variant="ghost">
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <Separator />
        <Button
          onClick={() => {
            enableEditing();
          }}
          variant="ghost"
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          <Pencil className="mr-2 size-4" /> Edit Board Name
        </Button>
        <Separator />
        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4" /> Copy Board
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-1 px-4 pl-[1.1rem] text-sm font-normal"
        >
          <ColorPicker id={data.id} value={data.color} setter={setBoardColor} />
          <span
            className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-300 group-hover:opacity-100"
            onClick={handleColorReset}
          >
            Reset
          </span>
        </Button>
        <Separator />
        <DeleteModal message={`Delete Board: ${data.name}`} deleteHandler={handleDelete}>
          <Button variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
            <Trash className="mr-2 size-4" /> Delete Board
          </Button>
        </DeleteModal>
      </PopoverContent>
    </Popover>
  );
}
