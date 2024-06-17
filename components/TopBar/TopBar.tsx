"use client";
import { useStore, useStorePersisted } from "@/store/store";
import { ThemeSwitcher } from "../ThemeSwitcher";
import BoardTitle from "./BoardTitle";
import TopBarOptions from "./TopBarOptions";
import { cn } from "@/utils";
import { useCollapsedContext } from "../Providers/CollapseProvider";
import { UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getContrastColor from "@/utils/getConstrastColor";
import { useTheme } from "next-themes";

export default function TopBar({ SubButton }: { SubButton: React.ReactNode }) {
  const { isCollapsed } = useCollapsedContext();
  const { resolvedTheme } = useTheme();
  const params = useParams<{ boardId: string }>();

  const orderedBoards = useStore((state) => state.orderedBoards);

  // const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const currentBoardData = orderedBoards?.find((board) => board.id === params.boardId) || null;

  const [textColor, setTextColor] = useState(currentBoardData?.color || "#fff");

  useEffect(() => {
    const color = currentBoardData?.backgroundColor;
    if (color) return setTextColor(getContrastColor(color));

    setTextColor(resolvedTheme === "dark" ? "#b3b3b3" : "#0a0a0a");
  }, [currentBoardData?.backgroundColor, resolvedTheme]);

  return (
    <div
      style={{
        backgroundColor: currentBoardData?.backgroundColor,
        transition: `padding-left 0.3s ease-in-out`,
      }}
      className={cn(
        "fixed inset-x-0 z-[50] flex h-14 w-screen items-center justify-center p-1 px-8 py-2 transition-all duration-300",
        isCollapsed ? "pl-[4rem]" : "pl-[18rem]",
      )}
    >
      {currentBoardData && <BoardTitle board={currentBoardData} textColor={textColor} />}

      <div className="ml-auto flex space-x-1.5 pl-1">
        <TopBarOptions data={currentBoardData} SubButton={SubButton} />
        <ThemeSwitcher />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonTrigger:
                "focus:outline-none ml-0.5 size-7 transition-all duration-100  focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 ",
              userButtonPopoverCard: "z-[99999]",
              avatarBox: "size-6",
              userButtonPopoverFooter: "hidden",
              // userButtonBox: "bg-neutral-200 dark:bg-neutral-800",
            },
          }}
        />
      </div>
    </div>
  );
}
