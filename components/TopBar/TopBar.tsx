import { BoardType } from "@/store/store";
import { ThemeSwitcher } from "../ThemeSwitcher";
import BoardTitle from "./BoardTitle";
type TopBarProps = {
  currentBoardData: BoardType;
};
export default function TopBar({ currentBoardData }: TopBarProps) {
  console.log("currentBoardData", currentBoardData);
  return (
    <h2 className="fixed flex p-1">
      <BoardTitle board={currentBoardData} />
      <ThemeSwitcher />
    </h2>
  );
}
