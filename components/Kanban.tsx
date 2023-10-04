"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";
import { ItemType, ListType } from "@/utils/types";

export default function Kanban() {
  // const [lists, setLists] = useStore((state) => [state.lists, state.setLists]);
  // const [listItems, setListItems] = useStore((state) => [state.items, state.setItems]);
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
    <div className="flex">
      <Sidebar />

      {currentBoardId && <Board lists={lists} listItems={listItems} setLists={setLists} setListItems={setListItems} currentBoardId={currentBoardId} />}
    </div>
  );
}
