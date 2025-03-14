"use client";

import { useRef, useState } from "react";
import { useEventListener, useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { ItemType, useStore } from "@/store/store";
import { Button } from "../ui/button";
import { PlusIcon, X } from "lucide-react";
import FormButton from "../Form/FormButton";
import FormTextArea from "../Form/FormTextArea";
import { createList } from "@/utils/actions/lists/createList";
import { createId } from "@paralleldrive/cuid2";
import { useParams } from "next/navigation";
import { BoardWithLists } from "@/utils/types";
import { toast } from "sonner";
import { useProModalStore } from "@/store/useProModal";
import { useShallow } from "zustand/shallow";

export default function AddList({ board }: { board: BoardWithLists }) {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const addList = useStore(useShallow((state) => state.addList));
  const removeList = useStore(useShallow((state) => state.removeList));
  const onOpen = useProModalStore(useShallow((state) => state.onOpen));

  const params = useParams<{ boardId: string }>();
  const isMobile = useMediaQuery("(max-width: 1000px)");

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
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;

    if (!title || !params.boardId) return;

    const newList = { id: createId(), title, items: [] as ItemType[], order: board.lists.length ?? 1, color: "", boardId: params.boardId };

    addList(newList);

    formRef.current?.reset();

    setTimeout(() => {
      disableEditing();
    }, 0);

    const res = await createList(newList);

    if (res?.error) {
      toast.error(res.error);
      removeList(newList.id, params.boardId);
      if (res.status === 403) {
        return onOpen();
      }
    }

    if (!isMobile) {
      // setTimeout(() => {
      // this method until hello-pangea/dnd adds support for nested scroll
      window.scrollTo({
        left: document.documentElement.scrollWidth,
        behavior: "smooth",
      });
      // }, 100);
    }
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  if (isEditing)
    return (
      <li className="ml-1 h-full w-[17rem] select-none">
        <form action={handleSubmit} ref={formRef} className="w-full rounded-md bg-neutral-100 p-2 shadow-md dark:bg-neutral-800">
          <FormTextArea
            rows={1}
            id="title"
            ref={textAreaRef}
            className="h-8 w-full border-transparent px-2 py-1 font-medium transition hover:border-input focus:border-input"
            placeholder="Enter List Name"
            // onBlur={onBlur}
          />
          <div className="flex items-center gap-1 pt-2">
            <FormButton className="font-semibold" variant="primary">
              Add List
            </FormButton>
            <Button variant="ghost" size="sm" onClick={disableEditing} className="dark:hover:bg-neutral-700">
              <X className="size-5" />
            </Button>
          </div>
        </form>
      </li>
    );

  return (
    <li className="ml-1 h-full w-[17rem] shrink-0 select-none">
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
