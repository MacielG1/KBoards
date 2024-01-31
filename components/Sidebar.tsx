// "use client";
// import { BoardType, useStore } from "@/store/store";
// import { v4 as uuidv4 } from "uuid";
// import { useEffect, useState } from "react";
// import { Icons } from "@/assets/Icons";

// export default function Sidebar() {
//   const [boards, addBoard, setBoards] = useStore((state) => [state.boards, state.addBoard, state.setBoards]);
//   const [currentBoardId, setCurrentBoardId] = useStore((state) => [state.currentBoardId, state.setCurrentBoardId]);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     setBoards(JSON.parse(localStorage.getItem("boards") || "[]"));
//   }, [setBoards]);

//   function changeCurrentBoard(id: string) {
//     if (id === currentBoardId) return;
//     setCurrentBoardId(id);
//     localStorage.setItem("currentBoardId", id);
//   }
//   function createBoard() {
//     const newBoard = {
//       id: uuidv4(),
//       title: `Board ${boards.length + 1}`,
//       lists: [],
//     };
//     addBoard(newBoard);
//     localStorage.setItem("boards", JSON.stringify([...boards, newBoard]));
//     setCurrentBoardId(newBoard.id);
//     localStorage.setItem("currentBoardId", newBoard.id);
//   }

//   function deleteBoard(board: BoardType) {
//     let newBoards = boards.filter((b) => b.id !== board.id);
//     setBoards(newBoards);
//     localStorage.setItem("boards", JSON.stringify(newBoards));
//     if (board.id === currentBoardId) {
//       // go to previous board
//       setCurrentBoardId(newBoards[newBoards.length - 1]?.id || null);
//       localStorage.setItem("currentBoardId", newBoards[newBoards.length - 1]?.id ?? null);
//     }
//   }
//   function changeBoardTitle(id: string, title: string) {
//     let newBoards = boards.map((b) => {
//       if (b.id === id) {
//         b.title = title;
//       }
//       return b;
//     });
//     setBoards(newBoards);
//     localStorage.setItem("boards", JSON.stringify(newBoards));
//   }

//   return (
//     <div className="min-w-[13rem] h-screen bg-neutral-900 text-white flex flex-col p-4">
//       <p className="text-xl tracking-wider whitespace-nowrap mb-4 text-center">Boards List</p>
//       <ul>
//         {boards.map((board) => (
//           <li
//             key={board.id}
//             className="cursor-pointer mb-2 bg-neutral-800 hover:bg-neutral-700 rounded pl-2 pr-1  py-2 transition-colors group duration-300"
//             onClick={() => changeCurrentBoard(board.id)}
//           >
//             <div className="peer flex justify-between items-center ">
//               {isEditing ? (
//                 <>
//                   <input
//                     className="bg-black w-full text-sm focus:border-neutral-500 border rounded-md outline-none pl-1"
//                     value={board.title}
//                     onChange={(e) => changeBoardTitle(board.id, e.target.value)}
//                     onBlur={(e) => {
//                       e.stopPropagation();
//                       setIsEditing((prev) => !prev);
//                     }}
//                     autoFocus
//                     maxLength={20}
//                     onKeyDown={(e) => {
//                       if (e.key !== "Enter") return;
//                       setIsEditing(false);
//                     }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <span className="truncate text-sm">{board.title}</span>
//                   <span className="space-x-1 peer flex justify-between items-center flex-nowrap">
//                     <button
//                       className={`text-red-600  hover:text-red-800 opacity-0 group-hover:opacity-100`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setIsEditing((prev) => !prev);
//                       }}
//                     >
//                       <Icons.pencil className="size-4 text-neutral-300 hover:text-neutral-400" />
//                     </button>
//                     <button
//                       className={`  text-red-600  hover:text-red-800 opacity-0 group-hover:opacity-100`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteBoard(board);
//                       }}
//                     >
//                       <Icons.trashIcon className="size-4 text-neutral-300 hover:text-red-400" />
//                     </button>
//                   </span>
//                 </>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//       <button
//         className="bg-neutral-900 hover:bg-black border-2 border-neutral-700 duration-300 w-[70%] self-center transition hover-bg-neutral-800 text-white rounded-2xl p-2 mt-4 "
//         onClick={createBoard}
//       >
//         Add Board
//       </button>
//     </div>
//   );
// }
