"use client";

import { useEffect, useRef, useState } from "react";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableStyle, Droppable } from "@hello-pangea/dnd";
import { type ListType, useStorePersisted, useSearchHighlight } from "@/store/store";
import Item from "../Item/Item";
import ListHeader from "./ListHeader";
import AddItem from "../Item/AddItem";
import { cn } from "@/utils";
import { useShallow } from "zustand/shallow";
import { useTheme } from "next-themes";

type ListItemProps = {
  index: number;
  data: ListType;
  checklistMode?: boolean | null;
};

export default function ListItem({ data, index, checklistMode }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [highlightProgress, setHighlightProgress] = useState(0);

  const showItemsOrder = useStorePersisted(useShallow((state) => state.showItemsOrder));
  const { highlightedId, highlightType, clearHighlight } = useSearchHighlight();
  const { resolvedTheme } = useTheme();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle highlight from search
  useEffect(() => {
    if (highlightedId === data.id && highlightType === "list") {
      setHighlightProgress(1);
      setTimeout(() => {
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      
      // Animate the highlight fading out
      const duration = 3000;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.max(0, 1 - elapsed / duration);
        setHighlightProgress(progress);
        if (progress > 0) {
          requestAnimationFrame(animate);
        } else {
          clearHighlight();
        }
      };
      requestAnimationFrame(animate);
    }
  }, [highlightedId, highlightType, data.id, clearHighlight]);

  const getHighlightStyle = () => {
    if (highlightProgress === 0) return {};
    const blueR = 30, blueG = 64, blueB = 115;
    const baseR = resolvedTheme === "dark" ? 64 : 226;
    const baseG = resolvedTheme === "dark" ? 64 : 226;
    const baseB = resolvedTheme === "dark" ? 64 : 226;
    
    const r = Math.round(blueR * highlightProgress + baseR * (1 - highlightProgress));
    const g = Math.round(blueG * highlightProgress + baseG * (1 - highlightProgress));
    const b = Math.round(blueB * highlightProgress + baseB * (1 - highlightProgress));
    
    return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      boxShadow: highlightProgress > 0.3 ? `0 0 ${8 * highlightProgress}px ${2 * highlightProgress}px rgba(30, 64, 115, ${0.4 * highlightProgress})` : 'none',
    };
  };

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
          ref={(el) => {
            provided.innerRef(el);
            (listRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          style={{ ...getStyle(provided.draggableProps.style || {}, snapshot) }}
          className="ml-3 w-68 select-none"
        >
          <div
            className="w-full rounded-md bg-[#e2e2e2] pb-2 shadow-md dark:bg-neutral-700"
            style={getHighlightStyle()}
          >
            <div {...provided.dragHandleProps} className={cn("cursor-pointer", data.items?.length > 0 ? "pb-2" : "mt-0")}>
              <ListHeader onAddItem={enableEditing} data={data} />
            </div>
            <div ref={scrollableRef} className={cn("listItemHeight scrollbar mx-1 mb-2 flex max-h-[69vh] flex-col overflow-y-auto", showItemsOrder && "ml-0")}>
              <Droppable droppableId={data.id} type="item">
                {(provided) => (
                  <ol
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(data.items?.length <= 0 ? "py-0.5" : "mx-0 pt-0 pb-1", showItemsOrder ? "mr-0.5 pr-1" : "")}
                  >
                    {data.items?.map((item, index) => (
                      <Item key={item.id} index={index} data={item} listLength={data.items.length} checklistMode={checklistMode} />
                    ))}
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
              scrollableRef={scrollableRef as React.RefObject<HTMLDivElement>}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}
