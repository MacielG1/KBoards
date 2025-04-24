"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BoardType, useStore, useStorePersisted } from "@/store/store";
import { Copy, Eraser, FileJson, ListOrdered, MoreHorizontal, Trash } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import DeleteModal from "../Modals/DeleteModal";
import ExportCSV from "./ExportCSV";
import ColorPicker from "../Form/ColorPicker";
import { updateBoardBackgroundColor } from "@/utils/actions/boards/updateBoardBackgroundColor";
import { useRouter } from "next/navigation";
import { deleteBoard } from "@/utils/actions/boards/deleteBoard";
import { copyBoard } from "@/utils/actions/boards/copyBoard";
import { createId } from "@paralleldrive/cuid2";
import { toast } from "sonner";
import { useProModalStore } from "@/store/useProModal";
import { Board } from "@/drizzle/schema";
import { useShallow } from "zustand/shallow";

type BoardOptionsProps = {
  data: BoardType | null;
  SubButton?: React.ReactNode;
};

export default function TopBarOptions({ data, SubButton }: BoardOptionsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const [bgColor, setBgColor] = useState(data?.backgroundColor ?? "");

  const removeBoard = useStore(useShallow((state) => state.removeBoard));
  const router = useRouter();
  const copyBoardState = useStore(useShallow((state) => state.copyBoard));
  const currentBoardId = useStorePersisted(useShallow((state) => state.currentBoardId));
  const setCurrentBoardId = useStorePersisted(useShallow((state) => state.setCurrentBoardId));
  const orderedBoards = useStore(useShallow((state) => state.orderedBoards));
  const setBoardBackgroundColor = useStore(useShallow((state) => state.setBoardBackgroundColor));
  const toggleItemsOrder = useStorePersisted(useShallow((state) => state.toggleItemsOrder));
  const showItemsOrder = useStorePersisted(useShallow((state) => state.showItemsOrder));
  const onOpen = useProModalStore(useShallow((state) => state.onOpen));

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
    closeRef.current?.click();

    setTimeout(() => {
      copyBoardState(data.id, newId);
    }, 300);

    const res = await copyBoard({ boardId: data?.id, newId });
    if (res?.error) {
      toast.error(res.error);
      removeBoard(newId);
      if (res.status === 403) {
        return onOpen();
      }
    }
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
      const { userId, ...rest } = board as typeof Board.$inferSelect;
      return rest;
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newAllBoards));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "All-Boards.json");

    document.body.appendChild(downloadAnchorNode); // required for firefox

    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
          variant="ghost"
          size="icon"
          className="size-7 bg-neutral-200 transition-all duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-900"
        >
          <MoreHorizontal className="size-5 text-black dark:text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverClose ref={closeRef} />
      <PopoverContent className="w-48 px-0 pb-3 pt-3" side="bottom" align="center">
        {data && (
          <>
            <div className="text-md flex flex-wrap justify-center px-2 pb-2 text-center font-medium text-neutral-500">
              <div>Board Options</div>
              <div className="w-full truncate px-2 pt-0.5 text-sm font-normal tracking-tight">{data.name}</div>
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
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`background-${data.id}`)?.click();
              }}
              variant="ghost"
              className="group h-auto w-full justify-start rounded-none p-2 px-5 pl-3 text-sm font-normal"
            >
              <ColorPicker id={data.id} value={bgColor} type="background" text="Background Color" setter={setBgColor} className="mr-2" />
              {bgColor !== "" && (
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

            <DeleteModal message={`Delete Board: ${data.name}`} deleteHandler={handleDelete}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant="ghost"
                className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal"
              >
                <Trash className="mr-2 size-4" /> Delete Board
              </Button>
            </DeleteModal>

            <Button
              variant="ghost"
              onClick={() => toggleItemsOrder()}
              className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal"
            >
              <ListOrdered className={`mr-2 size-4 ${showItemsOrder && "text-emerald-500 dark:text-green-500"}`} />{" "}
              <span>{showItemsOrder ? "Hide Items Order" : "Show Items Order"}</span>
            </Button>

            {data?.lists && data.lists?.length > 0 && <ExportCSV data={data} />}
          </>
        )}

        {orderedBoards.length > 0 && (
          <Button onClick={() => exportAllBoards()} variant="ghost" className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal">
            <FileJson className="mr-2 size-4" /> Export All Boards
          </Button>
        )}

        <Suspense fallback={null}>{SubButton}</Suspense>
      </PopoverContent>
    </Popover>
  );
}
