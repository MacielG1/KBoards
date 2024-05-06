import Board from "@/components/Board";
import { fetchBoard } from "@/utils/data/fetchBoard";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { boardId: string } }) {
  const board = await fetchBoard({ boardId: params.boardId });

  if (!board) notFound();

  return <Board board={board} />;
}
