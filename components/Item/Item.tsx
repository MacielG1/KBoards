"use client";

import { ItemType, useStorePersisted } from "@/store/store";
import { Draggable, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import ItemContent from "./ItemContent";

type ItemProps = {
  index: number;
  data: ItemType;
};

export default function Item({ index, data }: ItemProps) {
  const showItemsOrder = useStorePersisted((state) => state.showItemsOrder);

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
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={getStyle(provided.draggableProps.style || {}, snapshot)}
          className={`group relative  mb-0 flex items-center overflow-hidden ${showItemsOrder ? "mx-0" : "mx-1"}`}
        >
          <span className={`flex items-center justify-center ${showItemsOrder && "mr-[4px]"}`} style={{ minWidth: showItemsOrder ? "0.85rem" : 0 }}>
            {showItemsOrder && <span className="text-xs font-normal text-neutral-400">{index + 1}</span>}
          </span>
          <div
            className={`flex items-center justify-between overflow-hidden rounded-md border-2 border-transparent bg-neutral-100 text-sm shadow-sm hover:border-neutral-500 dark:bg-neutral-800 dark:hover:border-neutral-950 ${showItemsOrder ? "w-[91%]" : "w-full"}`}
          >
            <ItemContent data={data} />
          </div>
        </div>
      )}
    </Draggable>
  );
}
