"use client";

import { ListType, useStore } from "@/store/store";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import ListOptions from "./ListOptions";
import FormTextArea from "../Form/FormTextArea";
import getContrastColor from "@/utils/getConstrastColor";
import { cn } from "@/utils";
import { useTheme } from "next-themes";

type ListHeaderProps = {
  data: ListType;
  onAddCard: () => void;
};

export default function ListHeader({ data, onAddCard }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const [textColor, setTextColor] = useState(() => getComputedStyle(document.documentElement).getPropertyValue("--text-default"));

  const currentBoardId = useStore((state) => state.currentBoardId);
  const updateList = useStore((state) => state.updateList);
  const { resolvedTheme } = useTheme();

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

  function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    if (title === data.title) {
      return disableEditing();
    }

    if (!title) return;

    setTitle(title);
    updateList(currentBoardId, data.id, { ...data, title });
    disableEditing();
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
    if (data.color) return setTextColor(getContrastColor(data.color));

    setTextColor(resolvedTheme === "dark" ? "#fafafa" : "#0a0a0a");
  }, [data.color, resolvedTheme]);

  return (
    <div
      className={cn("flex items-start justify-between gap-1 rounded-t-md px-1 py-1.5 pl-2 text-sm font-semibold")}
      style={{ backgroundColor: data.color || "var(--list-default)" }}
    >
      {isEditing ? (
        <form action={handleSubmit} className="flex-1" ref={formRef}>
          <FormTextArea
            id="title"
            rows={1}
            ref={textAreaRef}
            className="w-full border-transparent bg-transparent px-1 py-0.5 font-medium transition hover:border-input focus:border-input "
            placeholder="Enter list title..."
            defaultValue={title}
            onBlur={onBlur}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          style={{ color: textColor }}
          onClick={enableEditing}
          className="w-[90%] min-w-[100px] break-words border-transparent bg-transparent px-1 py-0.5 text-sm font-medium"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} textColor={textColor} />
    </div>
  );
}
