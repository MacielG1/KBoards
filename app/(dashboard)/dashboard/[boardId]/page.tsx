import Kanban from "@/components/Kanban";
import prisma from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
type BoardIdPageProps = {
  params: {
    boardId: string;
  };
};
export default async function page({ params }: BoardIdPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const board = await prisma.board.findUnique({
    where: {
      id: params.boardId,
      userId,
    },
    include: {
      lists: {
        orderBy: {
          order: "asc",
        },
        include: {
          items: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });
  if (!board) {
    notFound();
  }

  return <Kanban board={board} />;
}
