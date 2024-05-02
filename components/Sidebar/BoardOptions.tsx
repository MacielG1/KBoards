"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BoardType, useStore, useStorePersisted } from "@/store/store";
import { Copy, MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import ColorPicker from "../Form/ColorPicker";
import DeleteModal from "../Modals/DeleteModal";
import { useMediaQuery } from "usehooks-ts";
import { deleteBoard } from "@/utils/actions/boards/deleteBoard";
import { updateBoardColor } from "@/utils/actions/boards/updateBoardColor";
import { useRouter } from "next/navigation";
import { copyBoard } from "@/utils/actions/boards/copyBoard";
import { createId } from "@paralleldrive/cuid2";

type BoardOptionsProps = {
  data: BoardType;
  enableEditing: () => void;
  textColor: string;
};

export default function BoardOptions({ data, enableEditing, textColor }: BoardOptionsProps) {
  const [boardColor, setBoardColorState] = useState(data.color);

  const closeRef = useRef<ElementRef<"button">>(null);

  const removeBoard = useStore((state) => state.removeBoard);
  const router = useRouter();
  const copyBoardState = useStore((state) => state.copyBoard);
  const setBoardColor = useStore((state) => state.setBoardColor);
  const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const orderedBoards = useStore((state) => state.orderedBoards);
  const setCurrentBoardId = useStorePersisted((state) => state.setCurrentBoardId);

  async function handleDelete() {
    removeBoard(data.id);
    closeRef.current?.click();

    setTimeout(() => {
      // router push to previous board in the orderedBoards array that comnes before the deleted board
      if (currentBoardId === data.id) {
        const index = orderedBoards.findIndex((board) => board.id === data.id);
        const previousBoard = orderedBoards[index - 1];
        if (previousBoard) {
          setCurrentBoardId(previousBoard.id);
          router.push(`/dashboard/${previousBoard.id}`);
        } else {
          router.push("/dashboard");
          setCurrentBoardId("");
        }
      }
    }, 0);

    await deleteBoard(data);
  }

  async function handleCopy() {
    const newId = createId();
    copyBoardState(data.id, newId);
    closeRef.current?.click();
    await copyBoard({ boardId: data.id, newId });
  }
  async function handleColorReset() {
    setBoardColorState("");
    setBoardColor(data.id, "");
    await updateBoardColor({ id: data.id, color: "" });
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
          className="h-auto w-auto border border-black bg-[#b4b4b4] p-[0.1rem] text-neutral-900 hover:bg-[#c7c7c7] dark:bg-[#353535] dark:text-neutral-300 dark:hover:bg-[#2b2b2b] dark:hover:text-white"
          variant="ghost"
        >
          <MoreHorizontal className="size-4" />
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
          tabIndex={-1}
          onClick={(e) => {
            // e.stopPropagation();
          }}
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-0 px-4 text-sm font-normal"
        >
          <ColorPicker id={data.id} value={boardColor} type="board" setter={setBoardColorState} />
          {boardColor !== "" && (
            <span
              className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-950 group-hover:opacity-100 dark:hover:text-neutral-300"
              onClick={(e) => {
                // e.stopPropagation();
                handleColorReset();
              }}
            >
              Reset
            </span>
          )}
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
