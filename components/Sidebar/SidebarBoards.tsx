"use client";
import { BoardType, useStore } from "@/store/store";
import BoardItem from "./BoardItem";
import AddBoard from "./Addboard";
import { DragDropContext, DropResult, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { reorder } from "@/utils/reorder";
import { useEffect } from "react";
import { updateBoardOrder } from "@/utils/actions/boards/updateBoardOrder";

export default function SidebarBoards({ boards }: { boards: BoardType[] }) {
  const [orderedBoards, setOrderedBoards] = useStore((state) => [state.orderedBoards, state.setOrderedBoards]);

  useEffect(() => {
    setOrderedBoards(boards);
  }, [boards, setOrderedBoards]);

  async function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;

    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === "board") {
      const items = reorder(orderedBoards, source.index, destination.index).map((board, index) => {
        return { ...board, order: index };
      });
      setOrderedBoards(items);
      return await updateBoardOrder(items);
    }
  }

  return (
    <div className="flex w-[13rem] min-w-[13rem] max-w-[13rem] flex-col p-4">
      <h1 className="mb-5 mt-2 whitespace-nowrap text-center text-xl tracking-wider">Boards</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" type="board" direction="vertical">
          {(provided: DroppableProvided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {orderedBoards.map((board, i) => {
                return <BoardItem key={board.id} index={i} board={board} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="self-center pt-3">
        <AddBoard />
      </div>
      <div className="flex-grow"></div>
    </div>
  );
}
