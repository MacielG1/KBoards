import { ItemType, useStorePersisted } from "@/store/store";
import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import FormTextArea from "../Form/FormTextArea";
import ItemOptions from "./ItemOptions";
import { updateItem } from "@/utils/actions/items/updateItem";
import { useShallow } from "zustand/shallow";

export default function ItemContent({ data }: { data: ItemType }) {
  const [content, setContent] = useState(data.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showItemsOrder = useStorePersisted(useShallow((state) => state.showItemsOrder));
  const textAlignment = useStorePersisted(useShallow((state) => state.textAlignment));

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function enableEditing() {
    setIsEditing(true);
    setIsFocused(true);
    setTimeout(() => {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.focus();
        const length = textArea.value.length;
        textArea.setSelectionRange(length, length);
      }
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

  async function handleSubmit(formData: FormData) {
    const content = formData.get(data.id) as string;

    if (!content || content === data.content || content.trim() === "") {
      return disableEditing();
    }

    setTimeout(() => {
      setContent(content);
      disableEditing();
    }, 0);

    await updateItem({ ...data, content });
  }

  function onTextAreaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }
  function onBlur() {
    setIsFocused(false);
    formRef.current?.requestSubmit();
  }

  useEventListener("keydown", onKeyDown);

  const textAlign = textAlignment === "center" ? "text-center" : textAlignment === "right" ? "text-right" : "text-left";

  return (
    <div
      style={{ backgroundColor: data.color || "var(--item-color)" }}
      className={`flex min-h-8 w-full items-center justify-between overflow-hidden rounded-md border-2 border-transparent text-sm shadow-xs ${isFocused ? "border-transparent" : "hover:border-neutral-500 dark:hover:border-neutral-950"}`}
    >
      <div className="flex w-full items-start justify-between rounded-t-md text-sm font-semibold">
        {isEditing ? (
          <form action={handleSubmit} className="flex-1" ref={formRef}>
            <FormTextArea
              rows={1}
              onBlur={onBlur}
              id={data.id}
              onKeyDown={onTextAreaKeyDown}
              defaultValue={content}
              ref={textAreaRef}
              className={`bg-transparent px-1 py-1 pl-2 backdrop-brightness-[1.17] dark:bg-transparent dark:focus-visible:bg-transparent ${textAlign}`}
            />
          </form>
        ) : (
          <>
            <div
              onClick={enableEditing}
              className={`relative min-h-7 w-full whitespace-pre-wrap break-words border-transparent bg-transparent px-1 py-1 pl-2 text-sm ${textAlign}`}
            >
              {content}
            </div>
            <span
              className={`absolute right-0 top-0 z-50 pt-[0.35rem] transition duration-100 md:opacity-0 md:group-hover:opacity-100 ${showItemsOrder ? "mr-[2%]" : "mr-1"}`}
            >
              <ItemOptions data={data} />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
