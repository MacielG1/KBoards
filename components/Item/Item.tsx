"use client";

import { ItemType, useStorePersisted } from "@/store/store";
import { Draggable, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import ItemContent from "./ItemContent";
import { useEffect, useState } from "react";
import getContrastColor from "@/utils/getConstrastColor";
import { useTheme } from "next-themes";
import { cn } from "@/utils";
import { getTextLength } from "@/utils/getTextLength";
import { useShallow } from "zustand/shallow";

type ItemProps = {
  index: number;
  data: ItemType;
  listLength: number;
  checklistMode?: boolean | null;
};

export default function Item({ index, data, listLength, checklistMode }: ItemProps) {
  const [textColor, setTextColor] = useState("var(--text-default)");
  const showItemsOrder = useStorePersisted(useShallow((state) => state.showItemsOrder));

  const { resolvedTheme } = useTheme();

  function getStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    return {
      ...style,
      transitionDuration: `0.1s`,
    };
  }

  useEffect(() => {
    if (data.color) return setTextColor(getContrastColor(data.color));

    setTextColor(resolvedTheme === "dark" ? "#fff" : "#0a0a0a");
  }, [data.color, resolvedTheme]);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{ ...getStyle(provided.draggableProps.style || {}, snapshot), color: textColor, cursor: "pointer" }}
          className={cn("group relative my-[5px] mb-0 flex items-center overflow-hidden", showItemsOrder ? "mx-0" : "mx-1")}
        >
          <span
            className={cn(`flex items-center justify-center ${showItemsOrder && "mx-0.5"}`, getTextLength(listLength) === "1ch" && showItemsOrder && "px-1")}
            style={{ minWidth: showItemsOrder ? getTextLength(listLength) : 0 }}
          >
            {showItemsOrder && !snapshot.isDragging && <span className="text-xs font-normal text-neutral-400">{index + 1}</span>}
          </span>

          <ItemContent data={data} checklistMode={checklistMode} />
        </div>
      )}
    </Draggable>
  );
}
