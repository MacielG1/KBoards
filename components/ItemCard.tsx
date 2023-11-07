import { useState } from "react";
import { ItemType } from "@/utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icons } from "@/assets/Icons";

interface Props {
  Item: ItemType;
  deleteItem: (id: string) => void;
  updateItem: (id: string, content: string) => void;
}

export default function Item({ Item, deleteItem, updateItem }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging, isSorting } = useSortable({
    id: Item.id,
    data: {
      type: "Item",
      Item,
    },
    disabled: isEditing,
  });

  const commonStyle = {
    transition,
    // transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    // transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const itemContent = isEditing ? (
    <textarea
      className="h-[90%] w-[95%] resize-none border-none rounded bg-transparent text-white focus:outline-none cursor-text"
      value={Item.content}
      placeholder="Item Content"
      autoFocus
      onBlur={toggleEditMode}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          toggleEditMode();
        }
      }}
      onChange={(e) => updateItem(Item.id, e.target.value)}
      onFocus={(e) => {
        let prev = e.target.value;
        e.target.value = "";
        e.target.value = prev;
      }}
    />
  ) : (
    <p className="my-auto text-white break-words min-h-[90%] w-[95%]  overflow-x-hidden cursor-pointer">{Item.content}</p>
  );

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={commonStyle} className="bg-neutral-900 break-words text-transparent  min-h-[5rem] rounded-xl cursor-grab">
        {Item.content}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={commonStyle}
      {...attributes}
      {...listeners}
      className="bg-neutral-950 p-2.5 min-h-[5rem] flex text-left rounded-xl relative group "
      onClick={toggleEditMode}
    >
      {itemContent}
      {
        <button
          onClick={() => {
            deleteItem(Item.id);
          }}
          className="absolute top-1 right-1 group-hover:inline-flex hidden"
        >
          <Icons.trashIcon className="w-5 h-5 text-neutral-600 hover:text-red-500 transition duration-300" />
        </button>
      }
    </div>
  );
}
