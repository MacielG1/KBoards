import { useStore } from "@/store/store";
import Button from "./Button";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

export default function Sidebar() {
  const [boards, addBoard, setBoards] = useStore((state) => [state.boards, state.addBoard, state.setBoards]);
  const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);

  useEffect(() => {
    setBoards(JSON.parse(localStorage.getItem("boards") || "[]"));
  }, []);

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
    setCurrentBoardId(newBoard.id);
    localStorage.setItem("currentBoardId", newBoard.id);
  }

  return (
    <div className="text-white">
      <p className="text-xl tracking-wider whitespace-nowrap">Boards List</p>
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
