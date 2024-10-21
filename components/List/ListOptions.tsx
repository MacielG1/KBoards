"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ListType, useStore, useStorePersisted } from "@/store/store";
import { AlignJustify, AlignLeft, AlignRight, Copy, MoreHorizontal, Plus, Trash, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import ColorPicker from "../Form/ColorPicker";
import DeleteModal from "../Modals/DeleteModal";
import { deleteList } from "@/utils/actions/lists/deleteList";
import { updateListColor } from "@/utils/actions/lists/updateListColor";
import { useParams } from "next/navigation";
import { copyList } from "@/utils/actions/lists/copyList";
import { createId } from "@paralleldrive/cuid2";
import ExportToBoard from "./ExportToBoard";
import { toast } from "sonner";
import { useProModalStore } from "@/store/useProModal";
import { useShallow } from "zustand/shallow";

type ListOptionsProps = {
  data: ListType;
  onAddItem: () => void;
  textColor: string;
};

export default function ListOptions({ data, onAddItem, textColor }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [listColor, setListColorState] = useState(data.color);
  const orderedBoards = useStore(useShallow((state) => state.orderedBoards));

  const params = useParams<{ boardId: string }>();

  const copyListState = useStore(useShallow((state) => state.copyList));
  const removeList = useStore(useShallow((state) => state.removeList));
  const setListColor = useStore(useShallow((state) => state.setListColor));
  const onOpen = useProModalStore(useShallow((state) => state.onOpen));
  const setTextAlignment = useStorePersisted(useShallow((state) => state.setTextAlignment));
  const textAlignment = useStorePersisted(useShallow((state) => state.textAlignment));

  async function handleDelete() {
    removeList(data.id, data.boardId);
    await deleteList(data);
    closeRef.current?.click();
  }

  async function handleCopy() {
    const newId = createId();
    closeRef.current?.click();
    copyListState(data.id, newId);

    const res = await copyList({ listId: data.id, boardId: data.boardId, newId });
    if (res?.error) {
      toast.error(res.error);
      removeList(newId, data.boardId);
      if (res.status === 403) {
        return onOpen();
      }
    }
  }

  function handleColorReset() {
    setListColorState("");
    setListColor(data.id, "", params.boardId);
    updateListColor({ id: data.id, color: "", boardId: data.boardId });
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
          <MoreHorizontal style={{ color: textColor }} className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 px-0 pb-3 pt-3" side="bottom" align="start" alignOffset={10}>
        <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-neutral-500">List Options</div>
        <PopoverClose asChild ref={closeRef}>
          <Button className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600 focus-visible:ring-neutral-700" variant="ghost">
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <Button onClick={onAddItem} className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal" variant="ghost">
          <Plus className="line mr-2 size-4" />
          <span className="pb-[1px]">Add Item </span>
        </Button>
        <Separator />
        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4" /> <span className="pb-[1px]">Copy List</span>
        </Button>

        <Separator />
        <Button
          tabIndex={-1}
          variant="ghost"
          className="group flex h-auto w-full cursor-default items-center justify-start rounded-none p-0 px-4 text-sm font-normal"
        >
          <ColorPicker id={data.id} value={listColor} type="list" setter={setListColorState} />
          {listColor !== "" && (
            <span
              className="ml-auto cursor-pointer text-sm text-neutral-600 opacity-0 transition duration-300 hover:text-black group-hover:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-200"
              onClick={handleColorReset}
            >
              Reset
            </span>
          )}
        </Button>

        <Separator />

        {orderedBoards.length > 1 && (
          <>
            <ExportToBoard listId={data.id} popoverRef={closeRef} />
            <Separator />
          </>
        )}

        <div className="inline-flex h-auto w-full items-center justify-start whitespace-nowrap rounded-none p-2 px-5 text-sm font-normal ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50">
          {textAlignment === "left" && <AlignLeft className="mr-2 size-4 shrink-0" />}
          {textAlignment === "center" && <AlignJustify className="mr-2 size-4 shrink-0" />}
          {textAlignment === "right" && <AlignRight className="mr-2 size-4 shrink-0" />}
          <span className="pb-[1px]">Align Items</span>
          <div className="flex items-center justify-center gap-1 px-5">
            <Button onClick={() => setTextAlignment("left")} className="h-auto w-auto p-0 text-sm font-normal" variant="transparent">
              <AlignLeft className={`size-[18px] ${textAlignment === "left" && "text-mainColor"}`} />
            </Button>
            <Button onClick={() => setTextAlignment("center")} className="h-auto w-auto p-0 text-sm font-normal" variant="transparent">
              <AlignJustify className={`size-[18px] ${textAlignment === "center" && "text-mainColor"}`} />
            </Button>
            <Button onClick={() => setTextAlignment("right")} className="h-auto w-auto p-0 text-sm font-normal" variant="transparent">
              <AlignRight className={`size-[18px] ${textAlignment === "right" && "text-mainColor"}`} />
            </Button>
          </div>
        </div>
        <Separator />
        <DeleteModal message={`Delete List: ${data.title}`} deleteHandler={handleDelete}>
          <Button variant="ghost" className="h-auto w-full items-center justify-start rounded-none p-2 px-5 pb-1 text-sm font-normal">
            <Trash className="mr-2 size-4" /> <span className="pb-[1px]">Delete List</span>
          </Button>
        </DeleteModal>
      </PopoverContent>
    </Popover>
  );
}
