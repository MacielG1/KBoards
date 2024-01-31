"use client";

// import { ListWithCards } from "@/types";
// import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableStyle, Droppable } from "@hello-pangea/dnd";
import { ListType } from "@/store/store";
import Card from "../Card/Card";
import ListHeader from "./ListHeader";
import CardForm from "../Card/AddCard";
import { cn } from "@/utils";

type ListItemProps = {
  index: number;
  data: ListType;
};

export default function ListItem({ data, index }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const scrollableRef = useRef<ElementRef<"div">>(null);

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
      // textAreaRef.current?.select();
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
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={getStyle(provided.draggableProps.style || {}, snapshot)}
          className="ml-2 w-[17rem] shrink-0 select-none"
        >
          <div className="w-full rounded-md bg-[#e2e2e2] pb-2 shadow-md dark:bg-neutral-700">
            <div {...provided.dragHandleProps} className={data.items.length > 0 ? "pb-2" : "mt-0"}>
              <ListHeader onAddCard={enableEditing} data={data} />
            </div>
            <div ref={scrollableRef} className={cn("mx-1 flex max-h-[62vh] flex-col overflow-y-auto")}>
              <Droppable droppableId={data.id} type="card">
                {(provided) => (
                  <ol ref={provided.innerRef} {...provided.droppableProps} className={cn("space-y-[0.35rem]", data.items.length <= 0 ? "py-1" : "py-0")}>
                    {data.items.map((card, index) => (
                      <Card key={card.id} index={index} data={card} />
                    ))}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
            </div>
            <CardForm
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              listId={data.id}
              scrollableRef={scrollableRef}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
