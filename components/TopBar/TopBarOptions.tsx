"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BoardType, useStore } from "@/store/store";
import { Copy, MoreHorizontal, Trash, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import DeleteModal from "../Modals/DeleteModal";
import ExportCSV from "./ExportCSV";

type BoardOptionsProps = {
  data: BoardType;
};

export default function TopBarOptions({ data }: BoardOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const removeBoard = useStore((state) => state.removeBoard);
  const copyBoard = useStore((state) => state.copyBoard);

  function handleDelete() {
    removeBoard(data.id);
    closeRef.current?.click();
  }

  function handleCopy() {
    copyBoard(data.id);
    closeRef.current?.click();
  }

  return (
    <Popover>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        <Button variant="outline" size="icon" className="h-[36px] w-[36px] border transition-all duration-300 hover:bg-transparent dark:hover:bg-transparent">
          <MoreHorizontal className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 px-0 pb-3  pt-3" side="bottom" align="center">
        <div className="flex items-center justify-center pb-2 text-center text-sm font-medium text-neutral-500">Board</div>
        <Button
          onClick={(e) => {
            // e.stopPropagation();
            handleCopy();
          }}
          variant="ghost"
          className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 text-sm font-normal"
        >
          <Copy className="mr-2 size-4" /> Copy Board
        </Button>
        <ExportCSV data={data} />
        <DeleteModal message={`Delete Board: ${data.name}`} deleteHandler={handleDelete}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-1 px-4 py-2  text-sm font-normal"
          >
            <Trash className="mr-2 size-4" /> Delete Board
          </Button>
        </DeleteModal>
      </PopoverContent>
    </Popover>
  );
}
