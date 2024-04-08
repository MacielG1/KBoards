import { ItemType, useStorePersisted } from "@/store/store";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import FormTextArea from "../Form/FormTextArea";
import ItemOptions from "./ItemOptions";
import { updateItem } from "@/utils/actions/items/updateItem";

export default function ItemContent({ data }: { data: ItemType }) {
  const [content, setContent] = useState(data.content);
  const [isEditing, setIsEditing] = useState(false);

  const showItemsOrder = useStorePersisted((state) => state.showItemsOrder);

  const formRef = useRef<ElementRef<"form">>(null);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  function enableEditing() {
    setIsEditing(true);
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
    const content = formData.get("content") as string;

    if (content === data.content || content.trim() === "") {
      return disableEditing();
    }
    setContent(content);

    disableEditing();

    await updateItem({ ...data, content });
  }

  function onTextAreaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }
  function onBlur() {
    formRef.current?.requestSubmit();
  }
  useEventListener("keydown", onKeyDown);

  return (
    <div className="flex w-full items-start justify-between rounded-t-md text-sm font-semibold">
      {isEditing ? (
        <form action={handleSubmit} className="flex-1" ref={formRef}>
          <FormTextArea
            rows={1}
            onBlur={onBlur}
            id="content"
            onKeyDown={onTextAreaKeyDown}
            defaultValue={content}
            ref={textAreaRef}
            className="px-1 py-1 pl-2 focus-visible:bg-[#ffffff]"
          />
        </form>
      ) : (
        <>
          <div
            onClick={enableEditing}
            className="relative w-[90%] whitespace-pre-wrap break-words border-transparent bg-transparent px-1 py-1 pl-2 text-sm md:w-full"
          >
            {content}
          </div>
          <span
            className={`absolute right-0 top-0 z-50 pt-[0.35rem] transition duration-100 md:opacity-0 md:group-hover:opacity-100 ${showItemsOrder ? "mr-3" : "mr-1"}`}
          >
            <ItemOptions data={data} />
          </span>
        </>
      )}
    </div>
  );
}
