import { useStore } from "@/store/store";
import Button from "./Button";
import { v4 as uuidv4 } from "uuid";

export default function Sidebar() {
  const [boards, addBoard] = useStore((state) => [state.boards, state.addBoard]);
  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);

  function changeCurrentBoard(id: string) {
    if (id === currentBoardId) return;
    setCurrentBoardId(id);
    localStorage.setItem("currentBoardId", id);
  }
  function createBoard() {
    const newBoard = {
      id: uuidv4(),
      title: `Board ${boards.length + 1}`,
      lists: [],
    };
    addBoard(newBoard);
    localStorage.setItem("boards", JSON.stringify([...boards, newBoard]));
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
      <Button onClick={createBoard}>Add Board</Button>
    </div>
  );
}
