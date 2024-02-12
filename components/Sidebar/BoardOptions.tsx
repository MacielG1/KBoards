"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BoardType, useStore } from "@/store/store";

import { Copy, MoreHorizontal, Pencil, Plus, Trash, X } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";

import ColorPicker from "../Form/ColorPicker";
import DeleteModal from "../Modals/DeleteModal";
import { useMediaQuery } from "usehooks-ts";
import { deleteBoard } from "@/utils/actions/deleteBoard";

type BoardOptionsProps = {
  data: BoardType;
  enableEditing: () => void;
  textColor: string;
};

export default function BoardOptions({ data, enableEditing, textColor }: BoardOptionsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const closeRef = useRef<ElementRef<"button">>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const removeBoard = useStore((state) => state.removeBoard);
  const copyBoard = useStore((state) => state.copyBoard);
  const setBoardColor = useStore((state) => state.setBoardColor); // takes a listId and a color

  function handleDelete() {
    removeBoard(data.id);
    closeRef.current?.click();

    deleteBoard(data);
  }

  function handleCopy() {
    copyBoard(data.id);
    closeRef.current?.click();
  }
  function handleColorReset() {
    setBoardColor(data.id, "");
  }

  return (
    <Popover>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        <Button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            borderColor: isHovered ? textColor : "transparent",
          }}
          className="h-auto w-auto border p-[0.15rem] transition-all duration-300 hover:bg-transparent dark:hover:bg-transparent"
          variant="ghost"
        >
          <MoreHorizontal style={{ color: textColor }} className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className=" px-0 pb-3 pt-3"
        side="bottom"
        align="start"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-neutral-500">Board Options</div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            onClick={(e) => {
              // e.stopPropagation();
            }}
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600 focus-visible:ring-neutral-700"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <Separator />
        <Button
          onClick={(e) => {
            // e.stopPropagation();
            enableEditing();
          }}
          variant="ghost"
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          <Pencil className="mr-2 size-4" /> Edit Board Name
        </Button>
        <Separator />
        <Button
          onClick={(e) => {
            // e.stopPropagation();
            handleCopy();
          }}
          variant="ghost"
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          <Copy className="mr-2 size-4" /> Copy Board
        </Button>
        <Separator />
        <Button
          onClick={(e) => {
            // e.stopPropagation();
          }}
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-1 px-4 pl-[1.1rem] text-sm font-normal"
        >
          <ColorPicker id={data.id} value={data.color} type="board" />
          <span
            className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-950 group-hover:opacity-100 dark:hover:text-neutral-300"
            onClick={(e) => {
              // e.stopPropagation();
              handleColorReset();
            }}
          >
            Reset
          </span>
        </Button>
        <Separator />
        <DeleteModal message={`Delete Board: ${data.name}`} deleteHandler={handleDelete}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            <Trash className="mr-2 size-4" /> Delete Board
          </Button>
        </DeleteModal>
      </PopoverContent>
    </Popover>
  );
}
