"use client";

import Board from "./Board";
import { BoardWithLists } from "@/utils/types";

export default function Kanban({ board }: { board: BoardWithLists }) {
  return <Board board={board} />;
}
