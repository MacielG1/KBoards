"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ListType, useStore } from "@/store/store";
import { Copy, MoreHorizontal, Plus, Trash, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import ColorPicker from "../Form/ColorPicker";
import DeleteModal from "../Modals/DeleteModal";
import { deleteList } from "@/utils/actions/lists/deleteList";
import { updateListColor } from "@/utils/actions/lists/updateListColor";
import { useParams } from "next/navigation";
import { copyList } from "@/utils/actions/lists/copyList";
import { v4 as uuidv4 } from "uuid";
import ExportToBoard from "./ExportToBoard";

type ListOptionsProps = {
  data: ListType;
  onAddItem: () => void;
  textColor: string;
};

export default function ListOptions({ data, onAddItem, textColor }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [listColor, setListColorState] = useState(data.color);

  const params = useParams<{ boardId: string }>();

  const copyListState = useStore((state) => state.copyList);
  const removeList = useStore((state) => state.removeList);
  const setListColor = useStore((state) => state.setListColor);

  async function handleDelete() {
    removeList(data.id, data.boardId);
    await deleteList(data);
    closeRef.current?.click();
  }

  async function handleCopy() {
    const newId = uuidv4();
    closeRef.current?.click();
    copyListState(data.id, newId);
    await copyList({ listId: data.id, boardId: data.boardId, newId });
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
          className=" h-auto w-auto border p-1 transition-all duration-300 hover:bg-transparent dark:hover:bg-transparent"
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
        <Button onClick={onAddItem} className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal" variant="ghost">
          <Plus className="mr-2 size-4" /> Add Item
        </Button>
        <Separator />
        <Button onClick={handleCopy} variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <Copy className="mr-2 size-4" /> Copy List
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
        <ExportToBoard listId={data.id} popoverRef={closeRef} />

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