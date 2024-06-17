"use client";
import TopBar from "@/components/TopBar/TopBar";
import { useStore } from "@/store/store";
import { useParams } from "next/navigation";

export default function Main({ SubButtonParent, children }: { SubButtonParent: React.ReactNode; children: React.ReactNode }) {
  const orderedBoards = useStore((state) => state.orderedBoards);
  const params = useParams<{ boardId: string }>();

  const currentBoardData = orderedBoards?.find((board) => board.id === params.boardId) || null;

  return (
    <main
      style={{
        backgroundColor: currentBoardData?.backgroundColor,
      }}
      className="relative flex flex-1 flex-grow"
    >
      <TopBar SubButton={SubButtonParent} />
      <div className="h-full flex-grow pt-14">{children}</div>
    </main>
  );
}
