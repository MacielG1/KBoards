"use client";
import { useStore } from "@/store/store";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { Icons } from "@/assets/Icons";
import { BoardType } from "@/utils/types";

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

  function deleteBoard(board: BoardType) {
    let newBoards = boards.filter((b) => b.id !== board.id);
    setBoards(newBoards);
    localStorage.setItem("boards", JSON.stringify(newBoards));
    if (board.id === currentBoardId) {
      // go to previous board
      setCurrentBoardId(newBoards[newBoards.length - 1]?.id || null);
      localStorage.setItem("currentBoardId", newBoards[newBoards.length - 1]?.id ?? null);
    }
  }

  return (
    <div className="min-w-[13rem] w-52 h-screen bg-neutral-900 text-white flex flex-col p-4">
      <p className="text-xl tracking-wider whitespace-nowrap mb-4 text-center">Boards List</p>
      <ul>
        {boards.map((board) => (
          <li
            key={board.id}
            className="cursor-pointer mb-2 bg-neutral-800 hover:bg-neutral-700 rounded p-2 transition-colors group duration-300"
            onClick={() => changeCurrentBoard(board.id)}
          >
            <div className="peer flex justify-between items-center">
              <span>{board.title}</span>
              <button
                className={` justify-self-end text-red-600 p-1 hover:text-red-800 opacity-0 group-hover:opacity-100`}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBoard(board);
                }}
              >
                <Icons.trashIcon className="w-5 h-5 text-neutral-300 hover:text-neutral-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="bg-neutral-900 hover:bg-black border-2 border-neutral-700 duration-300 w-[70%] self-center transition hover-bg-neutral-800 text-white rounded-2xl p-2 mt-4 "
        onClick={createBoard}
      >
        Add Board
      </button>
    </div>
  );
}
