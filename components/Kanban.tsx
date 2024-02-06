"use client";
import { useStore } from "@/store/store";
import { useEffect } from "react";
import Board from "./Board";
import TopBar from "./TopBar/TopBar";
import Navigation from "./Navigation";

export default function Kanban() {
  const [currentBoardData, setCurrentBoardData] = useStore((state) => [state.currentBoardData, state.setCurrentBoardData]);
  const [currentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
  const [boards] = useStore((state) => [state.boards]);

  useEffect(() => {
    if (currentBoardId) {
      const board = boards.find((board) => board.id === currentBoardId);
      if (board) {
        setCurrentBoardData(board);
      }
    }
  }, [boards, currentBoardId, setCurrentBoardData]);

  return (
    <div className="flex ">
      <Navigation />

      <main className="flex-1 space-y-5 px-2">
        {currentBoardData && <TopBar currentBoardData={currentBoardData} />}
        {currentBoardId && currentBoardData && <Board board={currentBoardData} currentBoardId={currentBoardId} />}
      </main>
    </div>
  );
}
