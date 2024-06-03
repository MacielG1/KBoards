"use client";
import { useStore, useStorePersisted } from "@/store/store";
import { ThemeSwitcher } from "../ThemeSwitcher";
import BoardTitle from "./BoardTitle";
import TopBarOptions from "./TopBarOptions";
import { cn } from "@/utils";
import { useCollapsedContext } from "../Providers/CollapseProvider";
import { UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function TopBar({ SubButton }: { SubButton: React.ReactNode }) {
  const { isCollapsed } = useCollapsedContext();
  const params = useParams<{ boardId: string }>();

  const orderedBoards = useStore((state) => state.orderedBoards);

  // const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const currentBoardData = orderedBoards?.find((board) => board.id === params.boardId) || null;
  // const currentBoardData = orderedBoards?.find((board) => board.id === currentBoardId) || null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-[50] flex h-14 w-screen items-center justify-center bg-background p-1 px-8 py-2 transition-all duration-300",
        isCollapsed ? "pl-[4rem]" : "pl-[18rem]",
      )}
    >
      {currentBoardData && <BoardTitle board={currentBoardData} />}
      {/* {!currentBoardData && <Skeleton className="h-7 w-64" />} */}

      <div className="ml-auto flex space-x-1 pl-1">
        {/* {currentBoardData && <TopBarOptions data={currentBoardData} />} */}

        <TopBarOptions data={currentBoardData} SubButton={SubButton} />
        <ThemeSwitcher />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonTrigger: "focus:outline-none ml-3  focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-0",
              userButtonPopoverCard: "z-[99999]",
            },
          }}
        />
      </div>
    </div>
  );
}
