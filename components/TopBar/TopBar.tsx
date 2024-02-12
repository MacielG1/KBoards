import { BoardType, useStore } from "@/store/store";
import { ThemeSwitcher } from "../ThemeSwitcher";
import BoardTitle from "./BoardTitle";
import TopBarOptions from "./TopBarOptions";
import { cn } from "@/utils";
import { useCollapsedContext } from "../Providers/CollapseProvider";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function TopBar() {
  const { isCollapsed } = useCollapsedContext();
  const currentBoardData = useStore((state) => state.currentBoardData);

  return (
    <div
      className={cn(
        "fixed inset-x-0 flex h-14 w-full items-center justify-center p-1 px-8 py-2 transition-all duration-300 ",
        isCollapsed ? "pl-[3rem]" : "pl-[18rem]",
      )}
    >
      {currentBoardData && <BoardTitle board={currentBoardData} />}
      <div className="ml-auto flex space-x-2 pl-1">
        {currentBoardData && <TopBarOptions data={currentBoardData} />}
        <ThemeSwitcher />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonTrigger: "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-0",
              userButtonPopoverCard: "z-[99999]",
            },
          }}
        />
      </div>
    </div>
  );
}
