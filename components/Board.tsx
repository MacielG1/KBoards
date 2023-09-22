"use client";
import { ItemType, ListType } from "@/utils/types";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import List from "./List";
import ItemOverlay from "./Overlays/ItemOverlay";
import { createPortal } from "react-dom";
import ListOverlay from "./Overlays/ListOverlay";
import { useStore } from "@/store/store";

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
  const [lists, setLists] = useStore((state) => [state.lists, state.setLists]);
  const [listItems, setListItems] = useStore((state) => [state.listItems, state.setListItems]);
  const { addListItem, deleteListItem, updateListItem, addList, deleteList, updateList } = useStore();
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

  useEffect(() => {
    const storedLists = localStorage.getItem("lists");
    const storedItems = localStorage.getItem("listItems");

    if (storedLists) {
      setLists(JSON.parse(storedLists));
    }

    if (storedItems) {
      setListItems(JSON.parse(storedItems));
    }
  }, []);

  function addItem(listId: string) {
    const newItem: ItemType = {
      id: uuidv4(),
      listId,
      content: `Item ${listItems.length + 1}`,
    };
    addListItem(newItem);

    localStorage.setItem("items", JSON.stringify([...listItems, newItem]));
  }

  function deleteItem(id: string) {
    deleteListItem(id);
    // CONVERT ABOVE TO USE STORE

    localStorage.setItem("items", JSON.stringify(listItems.filter((i) => i.id !== id)));
  }

  function updateItem(id: string, content: string) {
    updateListItem(id, content);

    localStorage.setItem("items", JSON.stringify(listItems));
  }

  function createList() {
    const newList: ListType = {
      id: uuidv4(),
      title: `List ${lists.length + 1}`,
    };

    addList(newList);
    localStorage.setItem("lists", JSON.stringify([...lists, newList]));
  }

  function deleteListHandler(id: string) {
    deleteList(id);
    localStorage.setItem("lists", JSON.stringify(lists.filter((i) => i.id !== id)));
  }

  function updateListHandler(id: string, title: string) {
    updateList(id, title);
    localStorage.setItem("lists", JSON.stringify(lists));
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

    // setLists((lists) => {
    //   const activeListIndex = lists.findIndex((i) => i.id === activeId);
    //   const overListIndex = lists.findIndex((i) => i.id === overId);

    //   let newOrder = arrayMove(lists, activeListIndex, overListIndex);
    //   localStorage.setItem("lists", JSON.stringify(newOrder));
    //   return newOrder;
    // });

    const activeListIndex = lists.findIndex((i) => i.id === activeId);
    const overListIndex = lists.findIndex((i) => i.id === overId);

    let newOrder = arrayMove(lists, activeListIndex, overListIndex);
    localStorage.setItem("lists", JSON.stringify(newOrder));
    setLists(newOrder);
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

      if (listItems[activeIndex].listId != listItems[overIndex].listId) {
        listItems[activeIndex].listId = listItems[overIndex].listId;

        let newOrder = arrayMove(listItems, activeIndex, overIndex);
        localStorage.setItem("listItems", JSON.stringify(newOrder));
        setListItems(newOrder);
      }
      let newOrder = arrayMove(listItems, activeIndex, overIndex);
      localStorage.setItem("listItems", JSON.stringify(newOrder));
      setListItems(newOrder);
    }

    const isOverAList = over.data.current?.type === "List";

    // Im dropping a Item over a List
    if (isActiveAnItem && isOverAList) {
      const activeIndex = listItems.findIndex((t) => t.id === activeId);

      listItems[activeIndex].listId = overId.toString();

      let newOrder = arrayMove(listItems, activeIndex, activeIndex);
      localStorage.setItem("listItems", JSON.stringify(newOrder));
      setListItems(newOrder);
    }
  }

  function saveChanges() {
    // save on DB
    // add to sidebar boardlist if not already there
  }

  let Overlay = (
    <DragOverlay dropAnimation={null}>
      {activeList && <ListOverlay list={activeList} deleteItem={deleteItem} updateItem={updateItem} items={listItems.filter((i) => i.listId === activeList.id)} />}

      {activeItem && <ItemOverlay content={activeItem.content} />}
    </DragOverlay>
  );

  const listIds = useMemo(() => lists.map((i) => i.id), [lists]);

  return (
    <main className="grid pt-16 pb-4 w-full place-items-center overflow-x-auto ">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} id="board">
        <div className="m-auto flex gap-4">
          <div className="flex gap-4   ">
            <SortableContext items={listIds}>
              {lists.map((list) => {
                console.log(list, listItems);
                return (
                  <List
                    list={list}
                    key={list.id}
                    deleteList={deleteListHandler}
                    updateList={updateListHandler}
                    addItem={addItem}
                    deleteItem={deleteItem}
                    updateItem={updateItem}
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
