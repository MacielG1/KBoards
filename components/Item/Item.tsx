// "use client";

// import { ItemType, useStorePersisted } from "@/store/store";
// import { Draggable, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
// import ItemContent from "./ItemContent";
// import { useEffect, useState } from "react";
// import getContrastColor from "@/utils/getConstrastColor";
// import { useTheme } from "next-themes";
// import { cn } from "@/utils";

// type ItemProps = {
//   index: number;
//   data: ItemType;
// };

// export default function Item({ index, data }: ItemProps) {
//   const [textColor, setTextColor] = useState("var(--text-default)");
//   const showItemsOrder = useStorePersisted((state) => state.showItemsOrder);

//   const { resolvedTheme } = useTheme();

//   function getStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot) {
//     if (!snapshot.isDropAnimating) {
//       return style;
//     }
//     return {
//       ...style,
//       transitionDuration: `0.1s`,
//     };
//   }

//   useEffect(() => {
//     if (data.color) return setTextColor(getContrastColor(data.color));

//     setTextColor(resolvedTheme === "dark" ? "#b3b3b3" : "#0a0a0a");
//   }, [data.color, resolvedTheme]);

//   return (
//     <Draggable draggableId={data.id} index={index}>
//       {(provided, snapshot) => (
//         <div
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           ref={provided.innerRef}
//           style={{ ...getStyle(provided.draggableProps.style || {}, snapshot), color: textColor }}
//           className={cn("group relative  mb-0 flex items-center overflow-hidden", showItemsOrder ? "mx-0" : "mx-1")}
//         >
//           <span className={`flex items-center justify-center ${showItemsOrder && "mr-[4px]"}`} style={{ minWidth: showItemsOrder ? "0.85rem" : 0 }}>
//             {showItemsOrder && <span className="text-xs font-normal text-neutral-400">{index + 1}</span>}
//           </span>
//           <div
//             style={{ backgroundColor: data.color || "var(--item-color)" }}
//             className={`flex items-center justify-between overflow-hidden rounded-md border-2 border-transparent text-sm shadow-sm hover:border-neutral-500  dark:hover:border-neutral-950 ${showItemsOrder ? "w-[91%]" : "w-full"}`}
//           >
//             <ItemContent data={data} />
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// }
"use client";

import { ItemType, useStorePersisted } from "@/store/store";
import { Draggable, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import ItemContent from "./ItemContent";
import { useEffect, useState } from "react";
import getContrastColor from "@/utils/getConstrastColor";
import { useTheme } from "next-themes";
import { cn } from "@/utils";

type ItemProps = {
  index: number;
  data: ItemType;
};

export default function Item({ index, data }: ItemProps) {
  const [textColor, setTextColor] = useState("var(--text-default)");
  const showItemsOrder = useStorePersisted((state) => state.showItemsOrder);

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
          className={cn("group relative mb-0 flex items-center overflow-hidden", showItemsOrder ? "mx-0" : "mx-1")}
        >
          <span className={`flex items-center justify-center ${showItemsOrder && "mr-[4px]"}`} style={{ minWidth: showItemsOrder ? "0.85rem" : 0 }}>
            {showItemsOrder && <span className="text-xs font-normal text-neutral-400">{index + 1}</span>}
          </span>

          <ItemContent data={data} />
        </div>
      )}
    </Draggable>
  );
}
