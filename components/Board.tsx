"use client";
import { ItemType, ListType } from "@/utils/types";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import List from "./List";
import ItemOverlay from "./Overlays/ItemOverlay";
import { createPortal } from "react-dom";
import ListOverlay from "./Overlays/ListOverlay";

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
  const [items, setItems] = useState<ItemType[]>([]);
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

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

  function addItem(listId: string) {
    const newItem: ItemType = {
      id: uuidv4(),
      listId,
      content: `Item ${items.length + 1}`,
    };

    setItems([...items, newItem]);
  }

  function deleteItem(id: string) {
    setItems((items) => items.filter((i) => i.id !== id));
  }

  function updateItem(id: string, content: string) {
    setItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        return { ...item, content };
      })
    );
  }

  function createList() {
    const newList: ListType = {
      id: uuidv4(),
      title: `List ${lists.length + 1}`,
    };

    setLists([...lists, newList]);
  }

  function deleteList(id: string) {
    setLists((lists) => lists.filter((i) => i.id !== id));
    setItems((items) => items.filter((i) => i.listId !== id));
  }

  function updateList(id: string, title: string) {
    setLists((list) =>
      list.map((list) => {
        if (list.id !== id) return list;
        return { ...list, title };
      })
    );
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "List") {
      return setActiveList(event.active.data.current.list);
    }

    if (event.active.data.current?.type === "Item") {
      return setActiveItem(event.active.data.current.Item);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveList(null);
    setActiveItem(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAList = active.data.current?.type === "List";
    if (!isActiveAList) return;

    setLists((lists) => {
      const activeListIndex = lists.findIndex((i) => i.id === activeId);
      const overListIndex = lists.findIndex((i) => i.id === overId);
      return arrayMove(lists, activeListIndex, overListIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAnItem = active.data.current?.type === "Item";
    const isOverAItem = over.data.current?.type === "Item";

    if (!isActiveAnItem) return;

    // Im dropping a Item over another Item
    if (isActiveAnItem && isOverAItem) {
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId);
        const overIndex = items.findIndex((t) => t.id === overId);

        if (items[activeIndex].listId != items[overIndex].listId) {
          // Fix introduced after video recording
          items[activeIndex].listId = items[overIndex].listId;
          return arrayMove(items, activeIndex, overIndex - 1);
        }

        return arrayMove(items, activeIndex, overIndex);
      });
    }

    const isOverAList = over.data.current?.type === "List";

    // Im dropping a Item over a List
    if (isActiveAnItem && isOverAList) {
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId);

        items[activeIndex].listId = overId.toString();
        return arrayMove(items, activeIndex, activeIndex);
      });
    }
  }

  let Overlay = (
    <DragOverlay dropAnimation={null}>
      {activeList && <ListOverlay list={activeList} deleteItem={deleteItem} updateItem={updateItem} items={items.filter((i) => i.listId === activeList.id)} />}

      {activeItem && <ItemOverlay content={activeItem.content} />}
    </DragOverlay>
  );

  const listIds = useMemo(() => lists.map((i) => i.id), [lists]);

  return (
    <main className="grid pt-10 pb-4 w-full place-items-center overflow-x-auto ">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} id="board">
        <div className="m-auto flex gap-4">
          <div className="flex gap-4   ">
            <SortableContext items={listIds}>
              {lists.map((list) => (
                <List
                  list={list}
                  key={list.id}
                  deleteList={deleteList}
                  updateList={updateList}
                  addItem={addItem}
                  deleteItem={deleteItem}
                  updateItem={updateItem}
                  items={items.filter((i) => i.listId === list.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createList();
            }}
            className="h-[60px] text-neutral-100 min-w-[15rem] cursor-pointer rounded-xl bg-neutral-950 ring ring-neutral-800 hover:bg-neutral-900 hover:ring-neutral-700  px-1 flex items-center justify-center  transition duration-300"
          >
            New List
          </button>
        </div>
        {typeof window !== "undefined" && createPortal(Overlay, document.querySelector("#modal-root") as HTMLElement)}
      </DndContext>
    </main>
  );
}
