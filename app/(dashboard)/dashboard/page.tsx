"use client";

import AddBoard from "@/components/Sidebar/Addboard";
import { useStore, useStorePersisted } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const setCurrentBoardId = useStorePersisted((state) => state.setCurrentBoardId);
  const orderedBoards = useStore((state) => state.orderedBoards);

  const params = useParams<{ boardId: string }>();

  useEffect(() => {
    if (currentBoardId && orderedBoards.find((board) => board.id === currentBoardId) && params.boardId !== currentBoardId) {
      router.push(`/dashboard/${currentBoardId}`);
    } else {
      setCurrentBoardId(null);
      router.push(`/dashboard`);
    }
  }, [currentBoardId, orderedBoards, params.boardId, router, setCurrentBoardId]);

  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <AddBoard />
      </div>
    </div>
  );
}
