"use client";
import type { ListType } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import ListOptions from "./ListOptions";
import FormTextArea from "../Form/FormTextArea";
import getContrastColor from "@/utils/getConstrastColor";
import { cn } from "@/utils";
import { useTheme } from "next-themes";
import { updateList as updateListTitle } from "@/utils/actions/lists/updateList";

type ListHeaderProps = {
  data: ListType;
  onAddItem: () => void;
};

export default function ListHeader({ data, onAddItem }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const [textColor, setTextColor] = useState(() => getComputedStyle(document.documentElement).getPropertyValue("--text-default"));

  const { resolvedTheme } = useTheme();

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

  function onKeyDownPressed(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
    }
  }

  useEventListener("keydown", onKeyDownPressed);

  function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;

    if (!title || title === data.title) {
      return disableEditing();
    }

    setTitle(title);

    // updateList(currentBoardId, data.id, { ...data, title });
    disableEditing();
    setTimeout(() => {
      updateListTitle({ ...data, title });
    }, 1);
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
    if (data.color) return setTextColor(getContrastColor(data.color));

    setTextColor(resolvedTheme === "dark" ? "#b3b3b3" : "#0a0a0a");
  }, [data.color, resolvedTheme]);

  return (
    <div
      className={cn("flex items-center justify-between gap-1 rounded-t-md px-1 py-0.5 pl-2 text-sm font-semibold")}
      style={{ backgroundColor: data.color || "var(--list-default)" }}
    >
      {isEditing ? (
        <form action={handleSubmit} className="flex-1" ref={formRef}>
          <FormTextArea
            id="title"
            rows={1}
            ref={textAreaRef}
            className="w-full border-transparent bg-transparent px-2 py-[0.25rem] font-medium transition hover:border-input focus:border-input"
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
          className="w-[90%] min-w-[100px] break-words border-transparent bg-transparent px-2 py-[0.25rem] text-sm font-medium"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddItem={onAddItem} textColor={textColor} />
    </div>
  );
}
