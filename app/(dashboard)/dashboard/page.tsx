"use client";

import AddBoard from "@/components/Sidebar/Addboard";
import { useStore, useStorePersisted } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const orderedBoards = useStore((state) => state.orderedBoards);

  useEffect(() => {
    if (currentBoardId && orderedBoards.find((board) => board.id === currentBoardId)) {
      router.push(`/dashboard/${currentBoardId}`);
    }
  }, [currentBoardId, router, orderedBoards]);

  if (!currentBoardId) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <AddBoard />
        </div>
      </div>
    );
  }
}
