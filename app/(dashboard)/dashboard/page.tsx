"use client";

import AddBoard from "@/components/Sidebar/Addboard";
import { useStore, useStorePersisted } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function Dashboard() {
  const router = useRouter();
  const currentBoardId = useStorePersisted(useShallow((state) => state.currentBoardId));
  const orderedBoards = useStore(useShallow((state) => state.orderedBoards));
  const [hasCheckedBoards, setHasCheckedBoards] = useState(false);

  useEffect(() => {
    if (orderedBoards.length > 0) {
      setHasCheckedBoards(true);
    }
  }, [orderedBoards]);

  useEffect(() => {
    if (hasCheckedBoards && currentBoardId && orderedBoards.find((board) => board.id === currentBoardId)) {
      router.push(`/dashboard/${currentBoardId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedBoards, currentBoardId]);

  if (!currentBoardId || !orderedBoards.find((board) => board.id === currentBoardId)) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <AddBoard />
        </div>
      </div>
    );
  }
}
