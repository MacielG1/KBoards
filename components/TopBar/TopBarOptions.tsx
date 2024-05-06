"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BoardType, useStore, useStorePersisted } from "@/store/store";
import { Copy, Eraser, FileJson, ListOrdered, MoreHorizontal, Trash } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import DeleteModal from "../Modals/DeleteModal";
import ExportCSV from "./ExportCSV";
import ColorPicker from "../Form/ColorPicker";
import { updateBoardBackgroundColor } from "@/utils/actions/boards/updateBoardBackgroundColor";
import { useRouter } from "next/navigation";
import { deleteBoard } from "@/utils/actions/boards/deleteBoard";
import { copyBoard } from "@/utils/actions/boards/copyBoard";
import { createId } from "@paralleldrive/cuid2";
import { Board } from "@prisma/client";

type BoardOptionsProps = {
  data: BoardType | null;
};

export default function TopBarOptions({ data }: BoardOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const [bgColor, setBgColor] = useState(data?.backgroundColor ?? "");

  const removeBoard = useStore((state) => state.removeBoard);
  const router = useRouter();
  const copyBoardState = useStore((state) => state.copyBoard);
  const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const setCurrentBoardId = useStorePersisted((state) => state.setCurrentBoardId);
  const orderedBoards = useStore((state) => state.orderedBoards);
  const setBoardBackgroundColor = useStore((state) => state.setBoardBackgroundColor);
  const toggleItemsOrder = useStorePersisted((state) => state.toggleItemsOrder);
  const showItemsOrder = useStorePersisted((state) => state.showItemsOrder);

  useEffect(() => {
    if (data) setBgColor(data.backgroundColor);
  }, [data]);

  async function handleDelete() {
    if (!data) return;

    removeBoard(data.id);
    closeRef.current?.click();

    setTimeout(() => {
      // router push to previous board in the orderedBoards array that comnes before the deleted board
      if (currentBoardId === data?.id) {
        const index = orderedBoards.findIndex((board) => board.id === data?.id);
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
    if (!data) return;

    const newId = createId();
    copyBoardState(data.id, newId);
    closeRef.current?.click();

    await copyBoard({ boardId: data?.id, newId });
  }

  async function handleColorReset() {
    if (!data) return;

    setBgColor("");
    setBoardBackgroundColor(data.id, "");
    await updateBoardBackgroundColor({ id: data?.id, backgroundColor: "" });
  }

  function exportAllBoards() {
    // export orderedBoards as JSON

    const newAllBoards = orderedBoards.map((board) => {
      const { userId, isCurrentBoard, ...rest } = board as Board;
      return rest;
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newAllBoards));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "All_Boards_export.json");

    document.body.appendChild(downloadAnchorNode); // required for firefox

    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  if (orderedBoards.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        <Button variant="ghost" size="icon" className="h-[36px] w-[36px]  transition-all duration-300 ">
          <MoreHorizontal className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverClose ref={closeRef} />
      <PopoverContent className="w-48 px-0 pb-3 pt-3" side="bottom" align="center">
        {data && (
          <>
            <div className="flex flex-wrap justify-center px-2 pb-2 text-center text-sm font-medium text-neutral-500">
              <div>Board Options</div>
              <div className="w-full truncate">{data.name}</div>
            </div>

            <Button
              onClick={(e) => {
                // e.stopPropagation();
                handleCopy();
              }}
              variant="ghost"
              className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal"
            >
              <Copy className="mr-2 size-4" /> Copy Board
            </Button>
            <Button
              variant="ghost"
              onClick={() => toggleItemsOrder()}
              className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal"
            >
              <ListOrdered className={`mr-2 size-4 ${showItemsOrder && "text-emerald-500 dark:text-green-500"}`} />{" "}
              <span>{showItemsOrder ? "Hide Items Order" : "Show Items Order"}</span>
            </Button>
            <Button
              tabIndex={-1}
              variant="ghost"
              className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-0 px-[0.87rem] text-sm font-normal"
            >
              <ColorPicker className="mr-[0.35rem] h-6 w-5" id={data.id} value={bgColor} type="background" text="Background Color" setter={setBgColor} />
              {bgColor !== "" && (
                <span
                  className="ml-auto cursor-pointer text-sm text-neutral-400 opacity-0 transition duration-300 hover:text-neutral-800 group-hover:opacity-100 dark:hover:text-neutral-300"
                  onClick={handleColorReset}
                >
                  <Eraser className="ml-2 size-4 shrink-0" />
                </span>
              )}
            </Button>
            <ExportCSV data={data} />

            <DeleteModal message={`Delete Board: ${data.name}`} deleteHandler={handleDelete}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant="ghost"
                className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4  text-sm font-normal"
              >
                <Trash className="mr-2 size-4" /> Delete Board
              </Button>
            </DeleteModal>
          </>
        )}

        <Button onClick={() => exportAllBoards()} variant="ghost" className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal">
          <FileJson className="mr-2 size-4" /> Export All Boards
        </Button>
      </PopoverContent>
    </Popover>
  );
}
