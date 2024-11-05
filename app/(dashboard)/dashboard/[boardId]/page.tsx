import Board from "@/components/Board";
import { fetchBoard } from "@/utils/fetchBoard";
import { notFound } from "next/navigation";

export default async function page(props: { params: Promise<{ boardId: string }> }) {
  const params = await props.params;
  const board = await fetchBoard({ boardId: params.boardId });

  if (!board) notFound();

  return <Board board={board} />;
}
