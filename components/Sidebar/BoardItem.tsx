"use client";

import { ElementRef, useRef, useState } from "react";
import { BoardType, ListType, useStore } from "@/store/store";
import Card from "../Card/Card";
import CardForm from "../Card/AddCard";
import { cn } from "@/utils";
import { Icons } from "@/assets/Icons";
import { FormInput } from "../Form/FormInput";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import { Pencil, Trash2 } from "lucide-react";
import DeleteModal from "../Modals/DeleteModal";
import BoardOptions from "./BoardOptions";

type BoardItemProps = {
  board: BoardType;
  index: number;
};

export default function BoardItem({ board, index }: BoardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  // const [title, setTitle] = useState(board.name);

  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
  const setBoardTitle = useStore((state) => state.setBoardTitle);
  const removeBoard = useStore((state) => state.removeBoard);

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

  function deleteBoard() {
    removeBoard(board.id);
  }

  function changeCurrentBoard() {
    if (board.id === currentBoardId) return;
    setCurrentBoardId(board.id);
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

  function getStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    return {
      ...style,
      transitionDuration: `0.1s`,
    };
  }

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
            `group mb-3 cursor-pointer rounded-lg border border-neutral-400 bg-neutral-200 pl-1.5  pr-1.5 transition-colors duration-300   `,
            board.id === currentBoardId ? "border-indigo-700 bg-neutral-300 dark:bg-neutral-900" : "hover:bg-neutral-300 dark:hover:bg-neutral-900/80",
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
                  defaultValue={board.name || "New Board"}
                  onBlur={onBlur}
                />
                <button type="submit" hidden />
              </form>
            ) : (
              <>
                <span className="w-full truncate py-2 pl-1 text-sm font-medium">{board.name}</span>
                <span className="peer absolute right-0 flex h-full flex-nowrap items-center justify-between gap-[0.1rem] opacity-0 group-hover:static group-hover:opacity-100">
                  <BoardOptions enableEditing={enableEditing} data={board} />
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
