"use client";

import { BoardType, useStore } from "@/store/store";
import { DragDropContext, DropResult, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import ListItem from "./List/ListItem";
import { reorder } from "../utils/reorder";
import AddList from "./List/AddList";
import { RefObject, useRef } from "react";
import TopBar from "./TopBar/TopBar";

type Props = {
  board: BoardType;
  currentBoardId: string;
};

export default function Board({ board, currentBoardId }: Props) {
  const updateBoard = useStore((state) => state.updateBoard);

  const containerRef = useRef<HTMLDivElement | null>(null); // Define the ref with proper typing

  function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;

    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Reorder lists
    if (type === "list") {
      const items = reorder(board.lists, source.index, destination.index).map((list, index) => {
        return { ...list, order: index };
      });

      return updateBoard(currentBoardId, { ...board, lists: items });
    }

    // Reorder cards

    if (type === "card") {
      let newOrderedData = [...board.lists];

      const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
      const destinationList = newOrderedData.find((list) => list.id === destination.droppableId);

      console.log("sourceList", sourceList);
      console.log("destinationList", destinationList);
      if (!sourceList || !destinationList) return;

      // check if sources lists has cards
      if (!sourceList.items) {
        sourceList.items = [];
      }

      // check if destination lists has cards
      if (!destinationList.items) {
        destinationList.items = [];
      }

      // move card in the same list

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.items, source.index, destination.index);

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.items = reorderedCards;
        updateBoard(currentBoardId, { ...board, lists: newOrderedData });
      } else if (source.droppableId !== destination.droppableId) {
        // move card from another list
        const [movedCard] = sourceList.items.splice(source.index, 1);

        // add card to destination list
        movedCard.listId = destinationList.id;
        destinationList.items.splice(destination.index, 0, movedCard);

        //  update the order of the cards in the source list
        sourceList.items.forEach((card, index) => {
          card.order = index;
        });

        // update the order of the cards in the destination list
        destinationList.items.forEach((card, index) => {
          card.order = index;
        });
        updateBoard(currentBoardId, { ...board, lists: newOrderedData });
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center pb-4 pt-8">
      <div className="grid place-items-center py-2 pr-2" ref={containerRef}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="lists" type="list" direction="horizontal">
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <ol className="flex ">
                  {board.lists.map((list, i) => {
                    return <ListItem key={list.id} index={i} data={list} />;
                  })}
                  {provided.placeholder}
                  <div className="pl-2">
                    <AddList />
                  </div>
                </ol>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
