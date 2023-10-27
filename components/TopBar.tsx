import { useStore } from "@/store/store";

export default function TopBar() {
  const currentBoardId = useStore((state) => state.currentBoardId);
  const boards = useStore((state) => state.boards);
  const currentBoardData = boards.find((b) => b.id === currentBoardId);

  return <h2>{currentBoardData?.title}</h2>;
}
