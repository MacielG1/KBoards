"use client";

import { ItemType } from "@/store/store";
import { Draggable, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import CardContent from "./CardContent";

type CardProps = {
  index: number;
  data: ItemType;
};

export default function Card({ index, data }: CardProps) {
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
          className="group relative mx-0.5 mb-1 flex items-center justify-between rounded-md border-2 border-transparent bg-neutral-100 text-sm shadow-sm hover:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-950"
        >
          <CardContent data={data} />
        </div>
      )}
    </Draggable>
  );
}
