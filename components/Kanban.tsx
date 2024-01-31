"use client";
import { useStore } from "@/store/store";
import { useEffect, useRef } from "react";
import Board from "./Board";
import TopBar from "./TopBar";

export default function Kanban() {
  const [currentBoardData, setCurrentBoardData] = useStore((state) => [state.currentBoardData, state.setCurrentBoardData]);
  const [currentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
  const [boards] = useStore((state) => [state.boards]);

  const boardRef = useRef<HTMLDivElement | null>(null); // Define the ref with proper typing

  useEffect(() => {
    if (currentBoardId) {
      const board = boards.find((board) => board.id === currentBoardId);
      if (board) {
        setCurrentBoardData(board);
      }
    }
  }, [boards, currentBoardId, setCurrentBoardData]);

  return (
    <div className=" flex ">
      {/* <Navigation /> */}
      <TopBar />
      <main className="h-screen flex-1 pl-4" ref={boardRef}>
        {currentBoardId && currentBoardData && <Board board={currentBoardData} currentBoardId={currentBoardId} boardRef={boardRef} />}
      </main>
    </div>
  );
}
