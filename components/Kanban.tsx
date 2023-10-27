"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";
import { ItemType, ListType } from "@/utils/types";
import Navigation from "./Navigation";

export default function Kanban() {
  const [lists, setLists] = useState<ListType[]>([]);
  const [listItems, setListItems] = useState<ItemType[]>([]);

  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);

  useEffect(() => {
    const id = localStorage.getItem("currentBoardId");

    let currentBoardData = null;
    if (id) {
      setCurrentBoardId(id);
      const storedData = localStorage.getItem(id);
      if (storedData) currentBoardData = JSON.parse(storedData);
    }

    setLists(currentBoardData?.lists || []);
    setListItems(currentBoardData?.items || []);
  }, [currentBoardId]);
  return (
    <div className="overflow-hidden flex h-screen">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto pl-1 flex">
        {currentBoardId && <Board lists={lists} listItems={listItems} setLists={setLists} setListItems={setListItems} currentBoardId={currentBoardId} />}
      </main>
    </div>
  );
}
