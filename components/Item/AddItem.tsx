"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import { forwardRef, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useStore, useStorePersisted } from "@/store/store";
import { createId } from "@paralleldrive/cuid2";
import FormButton from "../Form/FormButton";
import FormTextArea from "../Form/FormTextArea";
import { createItem } from "@/utils/actions/items/createItem";
import { useParams } from "next/navigation";
import { cn } from "@/utils";
import { getTextLength } from "@/utils/getTextLength";
import { useShallow } from "zustand/shallow";

type AddItemProps = {
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
  listId: string;
  scrollableRef: React.RefObject<HTMLDivElement>;
};

const AddItem = forwardRef<HTMLTextAreaElement, AddItemProps>(({ isEditing, enableEditing, disableEditing, listId, scrollableRef }, ref) => {
  const formRef = useRef<HTMLFormElement>(null);

  const showItemsOrder = useStorePersisted(useShallow((state) => state.showItemsOrder));
  const addItem = useStore(useShallow((state) => state.addItem));
  const lists = useStore(useShallow((state) => state.lists));
  const params = useParams<{ boardId: string }>();

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
    }
  }

  function onTextAreaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function focusOnTextArea() {
    (ref as React.RefObject<HTMLTextAreaElement>)?.current?.focus();
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

  function onBlur() {
    disableEditing();
    formRef.current?.requestSubmit();
  }

  useOnClickOutside(formRef as React.RefObject<HTMLElement>, onBlur);
  useEventListener("keydown", onKeyDown);

  const list = lists.find((list) => list.id === listId);
  const itemsLength = list ? list.items.length : 0;
  const lastOrder = list ? (list.items.at(-1)?.order ?? 0) : 0;

  return (
    <>
      {isEditing ? (
        <form
          ref={formRef}
          action={async (formData: FormData) => {
            await onSubmit(formData);
          }}
          className={cn(`mt-2 flex py-0.5`, showItemsOrder ? "mr-0.5 pr-2" : "mx-2", showItemsOrder && itemsLength <= 0 && "ml-2.5")}
        >
          {itemsLength > 0 && (
            <span
              className={cn(
                `invisible flex items-center justify-center ${showItemsOrder && "mx-0.5"}`,
                getTextLength(itemsLength ?? 0) === "1ch" && showItemsOrder && "px-1",
              )}
              style={{ minWidth: showItemsOrder ? getTextLength(itemsLength) : 0 }}
            >
              {showItemsOrder && <span className="text-xs font-normal text-neutral-400">{lastOrder}</span>}
            </span>
          )}
          <div className="w-full space-y-2">
            <FormTextArea
              id="content"
              onKeyDown={onTextAreaKeyDown}
              ref={ref}
              // onBlur={onBlur}
              className="px-2 focus-visible:ring-1 focus-visible:ring-neutral-500 focus-visible:ring-offset-0 dark:focus-visible:bg-neutral-800/80 dark:focus-visible:ring-neutral-950"
              placeholder="Item Content"
            />
            <input hidden id="listId" value={listId} name="listId" readOnly />
            <div className="flex items-center gap-1">
              <FormButton variant="primary" className="px-4 font-semibold">
                Add Item
              </FormButton>
              <Button onClick={disableEditing} size="sm" variant="ghost">
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mx-0 flex justify-center py-0.5">
          <div className={cn("flex w-full", showItemsOrder ? "mr-0.5 pr-2" : "mx-2", showItemsOrder && itemsLength <= 0 ? "ml-2.5" : "")}>
            {itemsLength > 0 && (
              <span
                className={cn(
                  `invisible flex items-center justify-center ${showItemsOrder && "mx-0.5"}`,
                  getTextLength(itemsLength ?? 0) === "1ch" && showItemsOrder && "px-1",
                )}
                style={{ minWidth: showItemsOrder ? getTextLength(itemsLength) : 0 }}
              >
                {showItemsOrder && <span className="text-xs font-normal text-neutral-400">{lastOrder}</span>}
              </span>
            )}
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
        </div>
      )}
    </>
  );
});

AddItem.displayName = "AddItem";
export default AddItem;
