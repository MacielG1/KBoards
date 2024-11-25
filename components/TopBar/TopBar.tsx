"use client";
import { useStore } from "@/store/store";
import { ThemeSwitcher } from "../ThemeSwitcher";
import BoardTitle from "./BoardTitle";
import TopBarOptions from "./TopBarOptions";
import { cn } from "@/utils";
import { useCollapsedContext } from "../Providers/CollapseProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getContrastColor from "@/utils/getConstrastColor";
import { useTheme } from "next-themes";
import UserButton from "../UserButton";
import { useShallow } from "zustand/shallow";

export default function TopBar({ SubButton }: { SubButton: React.ReactNode }) {
  const { isCollapsed } = useCollapsedContext();
  const { resolvedTheme } = useTheme();
  const params = useParams<{ boardId: string }>();

  const orderedBoards = useStore(useShallow((state) => state.orderedBoards));

  const currentBoardData = orderedBoards?.find((board) => board.id === params.boardId) || null;

  const [textColor, setTextColor] = useState(currentBoardData?.color || "#fff");

  useEffect(() => {
    const color = currentBoardData?.backgroundColor;
    if (color) return setTextColor(getContrastColor(color));

    setTextColor(resolvedTheme === "dark" ? "#b3b3b3" : "#0a0a0a");
  }, [currentBoardData?.backgroundColor, resolvedTheme]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-[50] flex h-14 w-screen items-center justify-center px-8 py-2 transition-all duration-300",
        isCollapsed ? "pl-[4rem]" : "pl-[18rem]",
      )}
    >
      {currentBoardData && <BoardTitle board={currentBoardData} textColor={textColor} />}

      <div className="ml-auto flex space-x-1.5 pl-1">
        <TopBarOptions data={currentBoardData} SubButton={SubButton} />
        <ThemeSwitcher />
        <UserButton
        // afterSignOutUrl="/"
        // }}
        />
      </div>
    </div>
  );
}
