"use client";
import { useStore } from "@/store/store";
import { useEffect } from "react";
import Board from "./Board";
import TopBar from "./TopBar/TopBar";
import Navigation from "./Navigation";
import AddBoard from "./Sidebar/Addboard";

export default function Kanban() {
  const [currentBoardData, setCurrentBoardData] = useStore((state) => [state.currentBoardData, state.setCurrentBoardData]);
  const [currentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
  const [boards] = useStore((state) => [state.boards]);

  useEffect(() => {
    const board = boards.find((board) => board.id === currentBoardId);
    setCurrentBoardData(board || null);
  }, [boards, currentBoardId, setCurrentBoardData]);

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 space-y-14">
        <TopBar />
        {boards.length > 0 ? (
          <>{currentBoardId && currentBoardData && <Board board={currentBoardData} currentBoardId={currentBoardId} />}</>
        ) : (
          <div className="flex h-[70vh] w-full items-center justify-center ">
            <div className="flex flex-col items-center">
              <AddBoard />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
