"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import { ElementRef, forwardRef, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useStore } from "@/store/store";
import { v4 as uuidv4 } from "uuid";
import FormButton from "../Form/FormButton";
import FormTextArea from "../Form/FormTextArea";

type AddCardProps = {
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
  listId: string;
  scrollableRef: React.RefObject<ElementRef<"div">>;
};

const AddCard = forwardRef<HTMLTextAreaElement, AddCardProps>(({ isEditing, enableEditing, disableEditing, listId, scrollableRef }, ref) => {
  const formRef = useRef<ElementRef<"form">>(null);

  const addItem = useStore((state) => state.addItem);
  const currentBoardId = useStore((state) => state.currentBoardId);

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

  function onSubmit(formData: FormData) {
    const content = formData.get("content") as string;

    if (!content) {
      return setTimeout(() => {
        focusOnTextArea();
      }, 200);
    }

    const newItem = {
      id: uuidv4(),
      content: content,
      listId,
      order: 0,
    };

    addItem(currentBoardId, listId, newItem);

    formRef.current?.reset();

    setTimeout(() => {
      scrollableRef.current?.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
      focusOnTextArea();
    }, 200);
  }

  return (
    <>
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="m-1 mx-0.5 space-y-4 px-1 py-0.5 ">
          <FormTextArea
            id="content"
            onKeyDown={onTextAreaKeyDown}
            ref={ref}
            className="px-2 focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-0 dark:focus-visible:bg-neutral-800/80"
            placeholder="Enter a title for this card"
          />
          <input hidden id="listId" value={listId} name="listId" readOnly />
          <div className="flex  items-center gap-1 ">
            <FormButton variant="accent" className="px-6">
              Add
            </FormButton>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="size-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="px-1.5 pt-2">
          <Button
            variant="ghost"
            onClick={enableEditing}
            size="sm"
            className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground hover:border-neutral-600 dark:hover:border-neutral-900"
          >
            <PlusIcon className="mr-2 size-4" />
            Add Card
          </Button>
        </div>
      )}
    </>
  );
});

AddCard.displayName = "CardForm";
export default AddCard;
