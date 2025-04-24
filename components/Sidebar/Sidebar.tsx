"use client";
import { BoardType, useStore } from "@/store/store";
import BoardItem from "./BoardItem";
import AddBoard from "./Addboard";
import { DragDropContext, DropResult, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { reorder } from "@/utils/reorder";
import { useEffect } from "react";
import { updateBoardOrder } from "@/utils/actions/boards/updateBoardOrder";
import { useShallow } from "zustand/shallow";
import { Suspense } from "react";

export default function Sidebar({ boards, SubscribeButton }: { boards: BoardType[], SubscribeButton?: React.ReactNode }) {
  const [orderedBoards, setOrderedBoards] = useStore(useShallow((state) => [state.orderedBoards, state.setOrderedBoards]));

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
    <div className="flex h-full w-[13rem] min-w-[13rem] max-w-[13rem] flex-col p-4 pr-[4px]">
      {/* Fixed Header */}
      <div className="flex-none">
        <h1 className="mb-3 mt-2 cursor-default whitespace-nowrap text-center text-[1.9rem] font-semibold tracking-wide text-mainColor">KBoards</h1>
      </div>
      
      {/* Scrollable Boards List */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-3 pr-1">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="boards" type="board" direction="vertical">
            {(provided: DroppableProvided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="px-0.5 pr-2"
              >
                {orderedBoards.map((board, i) => {
                  return <BoardItem key={board.id} index={i} board={board} />;
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      {/* Fixed Footer */}
      <div className="flex-none">
        <div className="self-center flex justify-center mb-3">
          <AddBoard />
        </div>
        
        <Suspense fallback={null}>
          <div className="flex w-full justify-center">
            {SubscribeButton}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
