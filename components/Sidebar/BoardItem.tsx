"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { BoardType, useStore, useStorePersisted } from "@/store/store";

import { cn } from "@/utils";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import BoardOptions from "./BoardOptions";
import getContrastColor from "@/utils/getConstrastColor";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { updateBoard } from "@/utils/actions/boards/updateBoard";
import FormTextArea from "../Form/FormTextArea";

type BoardItemProps = {
  board: BoardType;
  index: number;
};

export default function BoardItem({ board, index }: BoardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textColor, setTextColor] = useState("var(--text-default)");

  const [currentBoardId, setCurrentBoardId] = useStorePersisted((state) => [state.currentBoardId, state.setCurrentBoardId]);
  const updateCurrentBoardTitle = useStore((state) => state.updateCurrentBoardTitle);

  const { resolvedTheme } = useTheme();

  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);
  const params = useParams<{ boardId: string }>();

  const router = useRouter();

  function disableEditing() {
    setIsEditing(false);
  }

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

  async function changeCurrentBoard() {
    if (board.id === currentBoardId && params.boardId === board.id) return;

    router.prefetch(`/dashboard/${board.id}`);
    setCurrentBoardId(board.id);
    router.push(`/dashboard/${board.id}`);
  }

  async function changeBoardTitle(formData: FormData) {
    const title = formData.get("title") as string;

    if (title === board.name || !title) {
      return disableEditing();
    }

    disableEditing();
    updateCurrentBoardTitle(title, board.id);

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

    setTextColor(resolvedTheme === "dark" ? "#fff" : "#0a0a0a");
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
            cursor: "pointer",
          }}
          className={cn(
            `group mb-3 cursor-pointer rounded-lg transition-colors duration-300`,
            board.id === currentBoardId && "ring-1 ring-neutral-500 ring-offset-1 ring-offset-transparent dark:ring-neutral-500",
          )}
          onClick={() => changeCurrentBoard()}
        >
          <div className="relative flex w-full items-start justify-between rounded-t-md text-sm font-semibold">
            {isEditing ? (
              <form action={changeBoardTitle} className="flex-1" ref={formRef}>
                <FormTextArea
                  rows={1}
                  onBlur={onBlur}
                  id="title"
                  // onKeyDown={onTextAreaKeyDown}
                  defaultValue={board.name}
                  ref={textAreaRef}
                  className={"mx-0 bg-transparent px-1.5 py-1.5 pl-2 backdrop-brightness-[1.17] dark:bg-transparent dark:focus-visible:bg-transparent"}
                />
              </form>
            ) : (
              <>
                <span
                  style={{ color: textColor }}
                  className="relative mx-0 w-full whitespace-pre-wrap break-words border-transparent bg-transparent px-1.5 py-1.5 pl-2 text-sm"
                >
                  {board.name}
                </span>
                <span className="absolute right-0 top-0 z-50 pr-1 pt-[0.3rem] transition duration-100 md:opacity-0 md:group-hover:opacity-100">
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
