// "use client";
// import { useStore } from "@/store/store";
// import BoardItem from "./Sidebar/BoardItem";
// import AddBoard from "./Sidebar/Addboard";

// export default function Sidebar() {
//   const boards = useStore((state) => state.boards);

//   return (
//     <div className="flex min-w-[13rem] flex-grow flex-col p-4 ">
//       <p className="mb-4 whitespace-nowrap text-center text-xl tracking-wider">Boards</p>
//       <ul>
//         {boards.map((board) => {
//           return <BoardItem key={board.id} board={board} />;
//         })}
//       </ul>

//       <div className="self-center pt-3">
//         <AddBoard />
//       </div>
//     </div>
//   );
// }

"use client";
import { useStore } from "@/store/store";
import BoardItem from "./Sidebar/BoardItem";
import AddBoard from "./Sidebar/Addboard";
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
      <p className="mb-5 mt-2 whitespace-nowrap text-center text-xl tracking-wider">Boards</p>
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
