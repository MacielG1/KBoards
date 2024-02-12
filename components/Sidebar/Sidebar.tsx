"use client";
import { useStore } from "@/store/store";
import BoardItem from "./BoardItem";
import AddBoard from "./Addboard";
import { DragDropContext, DropResult, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { reorder } from "@/utils/reorder";

export default function Sidebar() {
  const boards = useStore((state) => state.boards);

  const setBoards = useStore((state) => state.setBoards);

  function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;

    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === "board") {
      const items = reorder(boards, source.index, destination.index);
      setBoards(items);
    }
  }

  return (
    <div className="flex h-screen w-[13rem] min-w-[13rem] max-w-[13rem] flex-col p-4">
      <h1 className="mb-5 mt-2 whitespace-nowrap text-center text-xl tracking-wider">Boards</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" type="board" direction="vertical">
          {(provided: DroppableProvided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {boards.map((board, i) => {
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
    </div>
  );
}
