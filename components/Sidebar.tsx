import { useStore } from "@/store/store";

export default function Sidebar() {
  const [boards] = useStore((state) => [state.boards]);
  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);

  function changeCurrentBoard(id: string) {
    if (id === currentBoardId) return;
    setCurrentBoardId(id);
    localStorage.setItem("currentBoardId", id);
  }

  return (
    <div className="text-white">
      <p>Sidebar</p>
      {boards.map((board) => {
        return (
          <div key={board.id} onClick={() => changeCurrentBoard(board.id)}>
            {board.title}
          </div>
        );
      })}
    </div>
  );
}
