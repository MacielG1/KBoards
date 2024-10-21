"use client";

import { useStore } from "@/store/store";
import { DragDropContext, DropResult, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import ListItem from "./List/ListItem";
import { reorder } from "../utils/reorder";
import AddList from "./List/AddList";
import { useEffect, useRef } from "react";
import { BoardWithLists } from "@/utils/types";
import { updateListOrder } from "@/utils/actions/lists/updateListOrder";
import { updateItemOrder } from "@/utils/actions/items/updateItemOrder";
import ScrollButtons from "./ScrollButtons";
import { useCollapsedContext } from "./Providers/CollapseProvider";
import { useShallow } from "zustand/shallow";

type Props = {
  board: BoardWithLists;
};

export default function Board({ board }: Props) {
  const [lists, setLists] = useStore(useShallow((state) => [state.lists, state.setLists]));
  const { isCollapsed } = useCollapsedContext();

  useEffect(() => {
    setLists(board.lists, board.id);
  }, [board.lists, board.id, setLists]);

  const containerRef = useRef<HTMLDivElement | null>(null); // Define the ref with proper typing

  async function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;

    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Reorder lists
    if (type === "list") {
      const items = reorder(lists, source.index, destination.index).map((list, index) => {
        return { ...list, order: index };
      });

      setLists(items, board.id);

      return await updateListOrder({ ...board, lists: items }, board.id);
    }

    // Reorder items

    if (type === "item") {
      let newOrderedData = [...board.lists];

      const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
      const destinationList = newOrderedData.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destinationList) return;

      if (!sourceList.items) {
        sourceList.items = [];
      }

      if (!destinationList.items) {
        destinationList.items = [];
      }

      // move item in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorder(sourceList.items, source.index, destination.index);

        if (!reorderedItems) return;

        reorderedItems.forEach((item, index) => {
          item.order = index;
        });

        sourceList.items = reorderedItems;
        // updateBoard(currentBoardId, { ...board, lists: newOrderedData });
        setLists(newOrderedData, board.id);
        return await updateItemOrder({ boardId: board.id, items: reorderedItems });
      } else if (source.droppableId !== destination.droppableId) {
        // move item from another list
        const [movedItem] = sourceList.items.splice(source.index, 1);

        // add item to destination list
        movedItem.listId = destinationList.id;
        destinationList.items.splice(destination.index, 0, movedItem);

        //  update the order of the items in the source list
        sourceList.items.forEach((item, index) => {
          item.order = index;
        });

        // update the order of the items in the destination list
        destinationList.items.forEach((item, index) => {
          item.order = index;
        });
        // updateBoard(currentBoardId, { ...board, lists: newOrderedData });
        setLists(newOrderedData, board.id);
        return await updateItemOrder({ boardId: board.id, items: destinationList.items });
      }
    }
  }

  return (
    <div
      className={`board-pt flex h-full w-full flex-col items-center justify-start px-3 pt-2 ${isCollapsed && "md:pl-[4rem]"}`}
      id={board.id}
      style={{
        transition: `padding-left 0.3s ease-in-out`,
      }}
    >
      <div className="grid place-items-center py-2 pr-2" ref={containerRef}>
        <DragDropContext
          autoScrollerOptions={{
            startFromPercentage: 0.1,
            maxScrollAtPercentage: 0.001,
            maxPixelScroll: 15,
            ease: (percentage) => Math.pow(percentage, 2),
            durationDampening: {
              stopDampeningAt: 1200,
              accelerateAt: 400,
            },
          }}
          onDragEnd={onDragEnd}
        >
          <Droppable droppableId="lists" type="list" direction="horizontal">
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <ol className="flex">
                  {lists.map((list, i) => {
                    return <ListItem key={list.id} index={i} data={list} />;
                  })}
                  {provided.placeholder}
                  <div className="pl-2">
                    <AddList board={board} />
                  </div>
                </ol>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <ScrollButtons />
    </div>
  );
}
