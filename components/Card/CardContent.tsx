import { ItemType, useStore } from "@/store/store";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import FormTextArea from "../Form/FormTextArea";
import CardOptions from "./CardOptions";

export default function CardContent({ data }: { data: ItemType }) {
  const [content, setContent] = useState(data.content);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const currentBoardId = useStore((state) => state.currentBoardId);
  const updateItem = useStore((state) => state.updateItem);

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

  function handleSubmit(formData: FormData) {
    const content = formData.get("content") as string;

    if (content === data.content) {
      return disableEditing();
    }
    setContent(content);
    updateItem(currentBoardId, data.listId, data.id, { ...data, content: content });

    disableEditing();
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
            className="px-1 py-1 pl-2"
          />
        </form>
      ) : (
        <>
          <div onClick={enableEditing} className="relative w-[100%] whitespace-pre-wrap break-words border-transparent bg-transparent px-1 py-1 pl-2 text-sm ">
            {content}
          </div>
          <span className="absolute right-0 top-0 z-50 mr-0.5 pt-[0.2rem] opacity-0 transition duration-100 group-hover:opacity-100">
            <CardOptions data={data} />
          </span>
        </>
      )}
    </div>
  );
}
