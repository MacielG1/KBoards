"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";

export default function Kanban() {
  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);

  return (
    <div className="flex">
      <Sidebar />
      <Board currentBoardId={currentBoardId} />
    </div>
  );
}
