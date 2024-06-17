"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableStyle, Droppable } from "@hello-pangea/dnd";
import { useStore, type ListType, useStorePersisted } from "@/store/store";
import Item from "../Item/Item";
import ListHeader from "./ListHeader";
import AddItem from "../Item/AddItem";
import { cn } from "@/utils";
import { getTextLength } from "@/utils/getTextLength";

type ListItemProps = {
  index: number;
  data: ListType;
};

export default function ListItem({ data, index }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const showItemsOrder = useStorePersisted((state) => state.showItemsOrder);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const scrollableRef = useRef<ElementRef<"div">>(null);

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
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
    <Draggable draggableId={data.id} index={index}>
      {(provided: DraggableProvided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={{ ...getStyle(provided.draggableProps.style || {}, snapshot) }}
          className="ml-3 w-[17rem] select-none"
        >
          <div className="w-full rounded-md bg-[#e2e2e2] pb-2 shadow-md dark:bg-neutral-700">
            <div {...provided.dragHandleProps} className={data.items?.length > 0 ? "pb-2" : "mt-0"} style={{ cursor: "pointer" }}>
              <ListHeader onAddItem={enableEditing} data={data} />
            </div>
            <div ref={scrollableRef} className={cn("listItemHeight scrollbar mx-1 mb-2 flex max-h-[69vh] flex-col overflow-y-auto", showItemsOrder && "ml-0")}>
              <Droppable droppableId={data.id} type="item">
                {(provided) => (
                  <ol
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn("space-y-[0.35rem]", data.items?.length <= 0 ? "py-0.5" : "mx-0 py-0", showItemsOrder ? "mr-0.5 pr-1" : "")}
                  >
                    {data.items?.map((item, index) => <Item key={item.id} index={index} data={item} listLength={data.items.length} />)}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
            </div>

            <AddItem
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              listId={data.id}
              scrollableRef={scrollableRef}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}
