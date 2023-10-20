"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";
import { ItemType, ListType } from "@/utils/types";

export default function Kanban() {
  const [lists, setLists] = useState<ListType[]>([]);
  const [listItems, setListItems] = useState<ItemType[]>([]);

  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
  const [boards, setBoards] = useStore((state) => [state.boards, state.setBoards]);
  const currentBoardData = boards.find((b) => b.id === currentBoardId);

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
    <div className="overflow-hidden flex h-screen gap-1">
      <div className="min-h-screen flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 min-h-screen overflow-x-hidden ">
        <div className="text-blue-500 text-center bg-neutral-900 py-3">{currentBoardData?.title}</div>
        {currentBoardId && <Board lists={lists} listItems={listItems} setLists={setLists} setListItems={setListItems} currentBoardId={currentBoardId} />}
      </div>
    </div>
  );
}
