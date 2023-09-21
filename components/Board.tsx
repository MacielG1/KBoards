"use client";
import { ListType } from "@/utils/types";
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const defaultLists: ListType[] = [
  {
    id: uuidv4(),
    title: "Todo",
  },
  {
    id: uuidv4(),
    title: "Finished",
  },
];

export default function Board() {
  const [lists, setLists] = useState<ListType[]>(defaultLists);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(pointerSensor, touchSensor);

  const listIds = useMemo(() => lists.map((i) => i.id), [lists]);

  return (
    <main className="grid pt-10 pb-4 w-full place-items-center overflow-x-auto ">
      <DndContext sensors={sensors} id="board">
        <div className="m-auto flex gap-4">
          <div className="flex gap-4  ">
            <SortableContext items={listIds}>
              q
              {lists.map((list) => (
                <>{list.title}</>
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </main>
  );
}
