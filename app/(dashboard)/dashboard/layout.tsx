import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar/TopBar";
import prisma from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const boards = await prisma.board.findMany({
    where: {
      userId,
    },
    include: {
      lists: {
        include: {
          items: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="relative flex h-full">
      <Navigation boards={boards} />
      <main className="relative flex flex-1 flex-grow">
        <TopBar boards={boards} />
        <div className="h-full flex-grow pt-14">{children}</div>
      </main>
    </div>
  );
}
