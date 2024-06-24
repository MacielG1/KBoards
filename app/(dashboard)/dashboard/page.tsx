// "use client";

// import AddBoard from "@/components/Sidebar/Addboard";
// import { useStore, useStorePersisted } from "@/store/store";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function Dashboard() {
//   const router = useRouter();
//   const currentBoardId = useStorePersisted((state) => state.currentBoardId);
//   const orderedBoards = useStore((state) => state.orderedBoards);

// useEffect(() => {
//   console.log(currentBoardId && orderedBoards.find((board) => board.id === currentBoardId));
//   if (currentBoardId && orderedBoards.find((board) => board.id === currentBoardId)) {
//     router.push(`/dashboard/${currentBoardId}`);
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

//   if (!currentBoardId || !orderedBoards.find((board) => board.id === currentBoardId)) {
//     return (
//       <div className="flex h-[70vh] w-full items-center justify-center">
//         <div className="flex flex-col items-center">
//           <AddBoard />
//         </div>
//       </div>
//     );
//   }
// }

"use client";

import AddBoard from "@/components/Sidebar/Addboard";
import { useStore, useStorePersisted } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const orderedBoards = useStore((state) => state.orderedBoards);
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
  }, [hasCheckedBoards]);

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
