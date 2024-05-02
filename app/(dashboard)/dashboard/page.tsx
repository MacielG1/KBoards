// "use client";

// import AddBoard from "@/components/Sidebar/Addboard";
// import { useStore, useStorePersisted } from "@/store/store";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function Dashboard() {
//   const router = useRouter();
//   const currentBoardId = useStorePersisted((state) => state.currentBoardId);
//   const setCurrentBoardId = useStorePersisted((state) => state.setCurrentBoardId);
//   const orderedBoards = useStore((state) => state.orderedBoards);

//   const params = useParams<{ boardId: string }>();

//   useEffect(() => {
//     if (currentBoardId && orderedBoards.find((board) => board.id === currentBoardId) && params.boardId !== currentBoardId) {
//       router.push(`/dashboard/${currentBoardId}`);
//     } else {
//       router.push(`/dashboard`);
//     }
//   }, [currentBoardId, orderedBoards, params.boardId, router, setCurrentBoardId]);

//   return (
//     <div className="flex h-[70vh] w-full items-center justify-center">
//       <div className="flex flex-col items-center">
//         <AddBoard />
//       </div>
//     </div>
//   );
// }

// "use client";

import AddBoard from "@/components/Sidebar/Addboard";
import { useStore, useStorePersisted } from "@/store/store";
import prisma from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const currentBoard = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  const currentBoardId = currentBoard?.id;

  if (currentBoardId) {
    console.log("called");
    redirect(`/dashboard/${currentBoardId}`);
  }

  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <AddBoard />
      </div>
    </div>
  );
}
