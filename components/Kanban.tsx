"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";
import { ItemType, ListType } from "@/utils/types";
import Navigation from "./Navigation";

export default function Kanban() {
  const [lists, setLists] = useStore((state) => [state.lists, state.setLists]);
  const [listItems, setListItems] = useStore((state) => [state.items, state.setItems]);

  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
  useEffect(() => {
    const id = localStorage.getItem("currentBoardId");

    let currentBoardData = null;
    if (id) {
      setCurrentBoardId(id);
      const storeBoard = localStorage.getItem(`board-${id}`);
      if (storeBoard) {
        currentBoardData = JSON.parse(storeBoard);
      }
    }

    setLists(currentBoardData?.lists || []);
    setListItems(currentBoardData?.items || []);
  }, [currentBoardId]);
  return (
    <div className="overflow-hidden flex h-screen">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto pl-4 flex">
        {currentBoardId && <Board lists={lists} listItems={listItems} setLists={setLists} setListItems={setListItems} currentBoardId={currentBoardId} />}
      </main>
    </div>
  );
}
