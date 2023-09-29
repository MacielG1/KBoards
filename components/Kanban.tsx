"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";

export default function Kanban() {
  const [lists, setLists] = useStore((state) => [state.lists, state.setLists]);
  const [listItems, setListItems] = useStore((state) => [state.items, state.setItems]);

  useEffect(() => {
    // const storedLists = localStorage.getItem("lists");
    // const storedItems = localStorage.getItem("items");

    const storedBoardId = localStorage.getItem("currentBoardId");
    const currentBoardId = storedBoardId ? JSON.parse(storedBoardId) : "main";

    const currentBoardData = localStorage.getItem(currentBoardId);

    if (currentBoardData) {
      const parsedData = JSON.parse(currentBoardData);
      if (parsedData.lists) {
        setLists(JSON.parse(parsedData.lists));
      }
      if (parsedData.items) {
        setListItems(JSON.parse(parsedData.items));
      }
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <Board lists={lists} listItems={listItems} setLists={setLists} setListItems={setListItems} />
    </div>
  );
}
