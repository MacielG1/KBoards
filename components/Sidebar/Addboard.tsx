"use client";

import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "../Form/FormInput";
import { useStore, useStorePersisted } from "@/store/store";
import { Button } from "../ui/button";
import { PlusIcon, X } from "lucide-react";
import FormButton from "../Form/FormButton";
import { v4 as uuidv4 } from "uuid";
import { createBoard } from "@/utils/actions/boards/createBoard";
import { useRouter } from "next/navigation";
import { ListWithItems } from "@/utils/types";

export default function AddBoard() {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const addBoard = useStore((state) => state.addBoard);
  const setCurrentBoardId = useStorePersisted((state) => state.setCurrentBoardId);
  const orderedBoards = useStore((state) => state.orderedBoards);

  const router = useRouter();

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }

  function disableEditing() {
    setIsEditing(false);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
    }
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  async function handleSubmit(formData: FormData) {
    try {
      const title = formData.get("title") as string;

      if (!title) {
        return console.log("Title is required");
      }

      const newId = uuidv4();
      const newBoard = {
        id: newId,
        name: title,
        lists: [] as ListWithItems[],
        color: "",
        backgroundColor: "",
        order: orderedBoards.length ?? 1,
      };

      addBoard(newBoard);
      setCurrentBoardId(newBoard.id);

      formRef.current?.reset();

      setIsEditing(false);

      setTimeout(() => {
        disableEditing();
        // router.push(`/dashboard/${newBoard.id}`);
      }, 0);

      await createBoard(newBoard);
    } catch (error) {
      console.error("error", error);
    }
  }

  if (isEditing) {
    return (
      <div className="h-full w-[10rem] select-none ">
        <form action={handleSubmit} ref={formRef} className="w-full space-y-1 rounded-md bg-white p-2 py-3 shadow-md dark:bg-neutral-700">
          <FormInput
            id="title"
            ref={inputRef}
            className="
              h-9
              w-full border-transparent px-2 py-1 font-medium transition hover:border-input focus:border-input dark:focus-visible:bg-transparent"
            placeholder="Enter Board Name"
          />
          <p className="flex items-center justify-center gap-1 pt-2 ">
            <FormButton size={"superSmall"} variant="primary" className="font-semibold">
              Add Board
            </FormButton>
            <Button variant="ghost" size="superSmall" onClick={disableEditing} className="dark:hover:bg-neutral-800">
              <X className="size-5" />
            </Button>
          </p>
        </form>
      </div>
    );
  }
  return (
    <div className="h-full w-[8rem] shrink-0 select-none">
      <Button
        variant="primary"
        onClick={enableEditing}
        className="flex w-full items-center justify-center rounded-xl p-2 py-[0.6rem] text-sm font-medium text-black transition duration-300 "
      >
        <PlusIcon className="mr-2 size-4" />
        Add Board
      </Button>
    </div>
  );
}
