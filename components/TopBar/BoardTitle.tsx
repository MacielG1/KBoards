import { BoardType, useStore } from "@/store/store";
import { ElementRef, useRef, useState } from "react";
import { FormInput } from "../Form/FormInput";

type BoardTitleProps = {
  board: BoardType;
};

export default function BoardTitle({ board }: BoardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  // const [title, setTitle] = useState(board.name);

  const setBoardTitle = useStore((state) => state.setBoardTitle);

  const inputRef = useRef<ElementRef<"input">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      // textAreaRef.current?.select();
    });
  }

  function changeBoardTitle(formData: FormData) {
    const title = formData.get("title") as string;
    const boardName = formData.get("boardName") as string;
    // if (!title) return disableEditing();

    if (title === boardName || !title) {
      return disableEditing();
    }

    // setTitle(title);
    disableEditing();
    setBoardTitle(board.id, title);
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }
  return (
    <div className="peer flex  w-[25rem] items-center justify-between">
      {isEditing ? (
        <form action={changeBoardTitle} className="flex-1" ref={formRef}>
          <input hidden id="boardName" value={board.name} name="boardName" readOnly />
          <FormInput
            ref={inputRef}
            id="title"
            className="bg-transparent px-1 py-0 text-sm font-medium transition focus:border-0 focus:bg-white focus:outline-0 focus:ring-0 dark:focus-visible:bg-transparent"
            placeholder="Enter board title..."
            defaultValue={board.name}
            onBlur={onBlur}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <>
          <span onClick={enableEditing} className="w-full truncate px-1 py-0 pt-[0.1rem] text-sm font-medium">
            {board.name}
          </span>
        </>
      )}
    </div>
  );
}
