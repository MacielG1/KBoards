import { BoardType, useStore, useStorePersisted } from "@/store/store";
import { ElementRef, useRef, useState } from "react";
import { FormInput } from "../Form/FormInput";
import { updateBoard } from "@/utils/actions/boards/updateBoard";

type BoardTitleProps = {
  board: BoardType;
  textColor: string;
};

export default function BoardTitle({ board, textColor }: BoardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updateCurrentBoardTitle = useStore((state) => state.updateCurrentBoardTitle);

  const inputRef = useRef<ElementRef<"input">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus());
  }

  async function changeBoardTitle(formData: FormData) {
    const title = formData.get("title") as string;
    const boardName = formData.get("boardName") as string;

    if (title === boardName || !title) {
      return disableEditing();
    }

    disableEditing();
    updateCurrentBoardTitle(title, board.id);

    updateBoard({ ...board, name: title });
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  return (
    <div
      className="peer flex w-[12rem] items-center justify-between sm:w-[30rem] lg:w-[50rem]"
      style={{
        backgroundColor: board.color || "var(--background)",
      }}
    >
      {isEditing ? (
        <form action={changeBoardTitle} className="flex-1" ref={formRef}>
          <input hidden id="boardName" value={board.name} name="boardName" readOnly />
          <FormInput
            ref={inputRef}
            id="title"
            className="px-1 py-0 pl-2 text-xl font-medium transition focus:border-0 focus:bg-neutral-200 focus:outline-0 focus:ring-0 dark:focus-visible:bg-neutral-800"
            // className="dark:transparent bg-transparent px-1 py-0 pl-2 text-xl font-medium transition hover:border-input focus:border-0 focus:border-input focus:outline-0 focus:ring-0"
            placeholder="Enter board title..."
            defaultValue={board.name}
            onBlur={onBlur}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <h2
          style={{ color: textColor }}
          onClick={enableEditing}
          className="w-full truncate whitespace-pre-wrap px-1 py-0 pl-2 pt-[0.1rem] font-medium md:text-xl"
        >
          {board.name}
        </h2>
      )}
    </div>
  );
}
