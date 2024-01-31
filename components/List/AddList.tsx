"use client";

import { ElementRef, RefObject, forwardRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "../Form/FormInput";
import { useStore } from "@/store/store";
import { Button } from "../ui/button";
import { PlusIcon, X } from "lucide-react";
import FormButton from "../Form/FormButton";
import FormTextArea from "../Form/FormTextArea";

export default function AddList() {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const addList = useStore((state) => state.addList);
  const currentBoardId = useStore((state) => state.currentBoardId);

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
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

  function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;

    if (!title) return;

    addList(currentBoardId || "main", title);

    formRef.current?.reset();
    disableEditing();

    setTimeout(() => {
      // this method until hello-pangea/dnd adds support for nested scroll
      window.scrollTo({
        left: document.documentElement.scrollWidth,
        behavior: "smooth",
      });
    }, 1000);
  }

  if (isEditing)
    return (
      <li className="h-full w-[17rem] select-none">
        <form action={handleSubmit} ref={formRef} className="w-full rounded-md bg-white p-2 shadow-md dark:bg-neutral-800">
          <FormTextArea
            rows={1}
            id="title"
            ref={textAreaRef}
            className="h-8 w-full border-transparent px-2 py-1 font-medium transition hover:border-input focus:border-input"
            placeholder="Enter title"
          />
          <div className="flex items-center gap-1 pt-2">
            <FormButton variant="accent">Add List</FormButton>
            <Button variant="ghost" size="sm" onClick={disableEditing} className="dark:hover:bg-neutral-700">
              <X className="size-5" />
            </Button>
          </div>
        </form>
      </li>
    );

  return (
    <li className="h-full w-[17rem] shrink-0 select-none">
      <button
        onClick={enableEditing}
        className="flex w-full items-center justify-center rounded-md bg-neutral-200 p-2 text-sm font-medium transition duration-300 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-700/90"
      >
        <PlusIcon className="mr-2 size-4" />
        Add List
      </button>
    </li>
  );
}
