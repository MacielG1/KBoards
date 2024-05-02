import Board from "@/components/Board";

import { fetchBoard } from "@/utils/data/fetchBoard";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type BoardIdPageProps = {
  params: {
    boardId: string;
  };
};

export default async function page({ params }: BoardIdPageProps) {
  const board = await fetchBoard({ boardId: params.boardId });

  if (!board) notFound();

  return <Board board={board} />;
}
