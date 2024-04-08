"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { BoardType, useStore, useStorePersisted } from "@/store/store";

import { cn } from "@/utils";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import BoardOptions from "./BoardOptions";
import getContrastColor from "@/utils/getConstrastColor";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateBoard } from "@/utils/actions/boards/updateBoard";
import { useCollapsedContext } from "../Providers/CollapseProvider";

type BoardItemProps = {
  board: BoardType;
  index: number;
};

export default function BoardItem({ board, index }: BoardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textColor, setTextColor] = useState("var(--text-default)");

  // const [title, setTitle] = useState(board.name);
  const [currentBoardId, setCurrentBoardId] = useStorePersisted((state) => [state.currentBoardId, state.setCurrentBoardId]);
  // const setBoardTitle = useStore((state) => state.setBoardTitle);

  const { resolvedTheme } = useTheme();

  const inputRef = useRef<ElementRef<"input">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const router = useRouter();

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

  function changeCurrentBoard() {
    if (board.id === currentBoardId) {
      return;
    }

    setCurrentBoardId(board.id);

    router.prefetch(`/dashboard/${board.id}`);
    router.push(`/dashboard/${board.id}`);
  }

  async function changeBoardTitle(formData: FormData) {
    const title = formData.get("title") as string;
    const boardName = formData.get("boardName") as string;

    if (title === boardName || !title) {
      return disableEditing();
    }

    // setTitle(title);
    disableEditing();
    // setBoardTitle(board.id, title);

    updateBoard({ ...board, name: title });
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  function getStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    return {
      ...style,
      transitionDuration: `0.1s`,
    };
  }

  useEffect(() => {
    if (board.color) return setTextColor(getContrastColor(board.color));

    setTextColor(resolvedTheme === "dark" ? "#b3b3b3" : "#0a0a0a");
  }, [board.color, resolvedTheme]);

  return (
    <Draggable draggableId={board.id} index={index}>
      {(provided: DraggableProvided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          style={{
            ...getStyle(provided.draggableProps.style || {}, snapshot),
            backgroundColor: board.color || "var(--board-default)",
          }}
          className={cn(
            `group mb-3 cursor-pointer rounded-lg pl-1.5 pr-1.5 transition-colors duration-300  `,
            board.id === currentBoardId && "ring-1 ring-neutral-500 ring-offset-1 ring-offset-transparent  dark:ring-neutral-500",
          )}
          onClick={() => changeCurrentBoard()}
        >
          <div className="peer relative flex cursor-pointer items-center justify-between">
            {isEditing ? (
              <form action={changeBoardTitle} className="flex-1" ref={formRef}>
                <input hidden id="boardName" value={board.name} name="boardName" readOnly className="w-full truncate py-2 pl-1 text-[0.8rem] font-medium" />
                <input
                  ref={inputRef}
                  id="title"
                  name="title"
                  className="w-full truncate border-0 bg-transparent py-2 pl-1 text-sm font-medium outline-0 ring-0 transition focus:border-0 focus:bg-white focus:outline-0 focus:ring-0 focus-visible:bg-transparent dark:focus-visible:bg-transparent"
                  placeholder="Enter board title..."
                  defaultValue={board.name}
                  onBlur={onBlur}
                />
                <button type="submit" hidden />
              </form>
            ) : (
              <>
                <span style={{ color: textColor }} className="w-full break-all py-2 pl-1 text-sm font-medium ">
                  {board.name}
                </span>
                <span className="peer static right-0 mt-1.5 flex h-full flex-nowrap items-center justify-between gap-[0.1rem] place-self-start pl-[0.5rem] md:opacity-0 md:group-hover:static md:group-hover:opacity-100">
                  <BoardOptions enableEditing={enableEditing} data={board} textColor={textColor} />
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
