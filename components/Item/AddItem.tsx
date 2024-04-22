"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import { ElementRef, forwardRef, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useStore } from "@/store/store";
import { createId } from "@paralleldrive/cuid2";
import FormButton from "../Form/FormButton";
import FormTextArea from "../Form/FormTextArea";
import { createItem } from "@/utils/actions/items/createItem";
import { useParams } from "next/navigation";

type AddItemProps = {
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
  listId: string;
  scrollableRef: React.RefObject<ElementRef<"div">>;
};

const AddItem = forwardRef<HTMLTextAreaElement, AddItemProps>(({ isEditing, enableEditing, disableEditing, listId, scrollableRef }, ref) => {
  const formRef = useRef<ElementRef<"form">>(null);

  const addItem = useStore((state) => state.addItem);
  // const currentBoardId = useStore((state) => state.currentBoardId);

  const lists = useStore((state) => state.lists);

  const params = useParams<{ boardId: string }>();

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
    }
  }

  useOnClickOutside(formRef, disableEditing);
  useEventListener("keydown", onKeyDown);

  function onTextAreaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function focusOnTextArea() {
    (ref as React.MutableRefObject<HTMLTextAreaElement | null>)?.current?.focus();
  }

  async function onSubmit(formData: FormData) {
    const content = formData.get("content") as string;

    if (!content) {
      return setTimeout(() => {
        focusOnTextArea();
      }, 200);
    }

    const newItem = {
      id: createId(),
      content: content,
      listId,
      order: lists.find((list) => list.id === listId)?.items.length ?? 1,
      boardId: params.boardId,
      color: "",
    };

    addItem(newItem, listId);

    formRef.current?.reset();

    focusOnTextArea();

    await createItem(newItem);

    setTimeout(() => {
      scrollableRef.current?.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  }

  return (
    <>
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="mx-0.5 mt-2 space-y-4 px-2 py-0.5 ">
          <FormTextArea
            id="content"
            onKeyDown={onTextAreaKeyDown}
            ref={ref}
            className="px-2 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-0 dark:focus-visible:bg-neutral-800/80 dark:focus-visible:ring-neutral-950"
            placeholder="Item Content"
          />
          <input hidden id="listId" value={listId} name="listId" readOnly />
          <div className="flex items-center gap-1 ">
            <FormButton variant="primary" className="px-4 font-semibold">
              Add Item
            </FormButton>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="size-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-2 px-2 py-0.5">
          <Button
            variant="ghost"
            onClick={enableEditing}
            size="sm"
            className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground hover:border-neutral-600 dark:hover:border-neutral-900"
          >
            <PlusIcon className="mr-2 size-4" />
            Add Item
          </Button>
        </div>
      )}
    </>
  );
});

AddItem.displayName = "AddItem";
export default AddItem;
