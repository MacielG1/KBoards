"use client";
import { BoardType, ItemType, ListType } from "@/utils/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSwappingStrategy } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import List from "./List";
import ItemOverlay from "./Overlays/ItemOverlay";
import { createPortal } from "react-dom";
import ListOverlay from "./Overlays/ListOverlay";
import { useStore } from "@/store/store";

type Props = {
  lists: ListType[];
  listItems: ItemType[];
  setLists: (lists: ListType[]) => void;
  setListItems: (items: ItemType[]) => void;
  currentBoardId: string;
};

export default function Board({ lists, listItems, setLists, setListItems, currentBoardId }: Props) {
  const { addItem, deleteItem, updateItem, addList, deleteList, updateList } = useStore();
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null); // Define the ref with proper typing
  const firstRender = useRef(true);

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

  function addNewItem(listId: string, content: string) {
    const newItem: ItemType = {
      id: uuidv4(),
      listId,
      content,
    };
    // addItem(newItem);
    setListItems([...listItems, newItem]);

    localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists, items: [...listItems, newItem] }));
  }

  function deleteListItem(id: string) {
    // deleteItem(id);
    setListItems(listItems.filter((i) => i.id !== id));

    localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists, items: listItems.filter((i) => i.id !== id) }));
  }

  function updateListItem(id: string, content: string) {
    // updateItem(id, content);
    setListItems(listItems.map((i) => (i.id === id ? { ...i, content } : i)));
    localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists, items: listItems }));
  }

  function createList() {
    if (firstRender.current) {
      firstRender.current = false;
    }

    const newList: ListType = {
      id: uuidv4(),
      title: `List ${lists.length + 1}`,
      items: [],
    };

    // addList(newList);
    setLists([...lists, newList]);
    setListItems([...listItems]);

    localStorage.setItem(currentBoardId, JSON.stringify({ lists: [...lists, newList], items: listItems }));
  }

  function deleteListHandler(id: string) {
    // deleteList(id);
    setLists(lists.filter((i) => i.id !== id));
    setListItems(listItems.filter((i) => i.listId !== id));
    localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists.filter((i) => i.id !== id), items: listItems }));
  }

  function updateListHandler(id: string, title: string) {
    // updateList(id, title);
    setLists(lists.map((i) => (i.id === id ? { ...i, title } : i)));

    localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists, items: listItems }));
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

    const activeListIndex = lists.findIndex((i) => i.id === activeId);
    const overListIndex = lists.findIndex((i) => i.id === overId);

    let newOrder = arrayMove(lists, activeListIndex, overListIndex);
    localStorage.setItem(currentBoardId, JSON.stringify({ lists: newOrder, items: listItems }));

    return setLists(newOrder);
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
      const activeIndex = listItems.findIndex((t) => t.id === activeId);
      const overIndex = listItems.findIndex((t) => t.id === overId);

      let newOrder;
      if (listItems[activeIndex].listId != listItems[overIndex].listId) {
        listItems[activeIndex].listId = listItems[overIndex].listId;
        newOrder = arrayMove(listItems, activeIndex, overIndex - 1);
      } else {
        newOrder = arrayMove(listItems, activeIndex, overIndex);
      }
      localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists, items: newOrder }));
      return setListItems(newOrder);
    }

    const isOverAList = over.data.current?.type === "List";

    // Im dropping a Item over a List
    if (isActiveAnItem && isOverAList) {
      const activeIndex = listItems.findIndex((t) => t.id === activeId);

      listItems[activeIndex].listId = overId.toString();

      let newOrder = arrayMove(listItems, activeIndex, activeIndex);
      localStorage.setItem(currentBoardId, JSON.stringify({ lists: lists, items: newOrder }));
      return setListItems(newOrder);
    }
  }

  let Overlay = (
    <DragOverlay dropAnimation={null}>
      {activeList && <ListOverlay list={activeList} deleteItem={deleteItem} updateItem={updateItem} items={listItems.filter((i) => i.listId === activeList.id)} />}
      {activeItem && <ItemOverlay content={activeItem.content} />}
    </DragOverlay>
  );

  useEffect(() => {
    if (firstRender.current) {
      return; // Don't scroll on the first render
    }

    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth, // Scroll to the right edge
        behavior: "smooth",
      });
    }
  }, [createList]);

  const listIds = useMemo(() => lists.map((i) => i.id), [lists]);
  return (
    <>
      <main className="flex flex-col w-full items-center justify-center pt-16 pb-4">
        <div className="grid py-2 pr-6 w-full place-items-center overflow-x-auto" ref={containerRef}>
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} id="board">
            <div className="flex gap-4">
              <div className="flex gap-4   ">
                <SortableContext items={listIds} id="lists">
                  {lists.map((list) => {
                    console.log(list, listItems);
                    return (
                      <List
                        list={list}
                        key={list.id}
                        deleteList={deleteListHandler}
                        updateList={updateListHandler}
                        addItem={addNewItem}
                        deleteItem={deleteListItem}
                        updateItem={updateListItem}
                        items={listItems.filter((i) => i.listId === list.id)}
                      />
                    );
                  })}
                </SortableContext>
              </div>
              <button
                onClick={() => {
                  createList();
                }}
                className="h-[60px] text-neutral-100 min-w-[15rem] cursor-pointer rounded-xl bg-neutral-950 ring ring-neutral-800 hover:bg-neutral-900 hover:ring-neutral-700  flex items-center justify-center  transition duration-300"
              >
                New List
              </button>
            </div>
            {typeof window !== "undefined" && createPortal(Overlay, document.querySelector("#modal-root") as HTMLElement)}
          </DndContext>
        </div>
      </main>
    </>
  );
}
