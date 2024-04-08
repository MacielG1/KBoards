import { useStore } from "@/store/store";
import { useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { moveList } from "@/utils/actions/lists/moveList";
import { Button } from "../ui/button";

type ExportToBoardProps = {
  listId: string;
  popoverRef: React.RefObject<HTMLButtonElement>;
};

export default function ExportToBoard({ listId, popoverRef }: ExportToBoardProps) {
  const orderedBoards = useStore((state) => state.orderedBoards);

  const params = useParams<{ boardId: string }>();
  const boards = orderedBoards.filter((board) => board.id !== params.boardId);
  const moveListState = useStore((state) => state.moveList);

  async function handleMoveToBoard({ boardId }: { boardId: string }) {
    moveListState(listId, boardId);
    popoverRef.current?.click();
    await moveList({ boardId, listId });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
          <ExternalLink className="mr-2 size-4" /> Move List
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[10rem]" sideOffset={0.5}>
        <DropdownMenuLabel className="text-center">Move to board</DropdownMenuLabel>
        {boards?.map((board) => (
          <DropdownMenuItem className="max-w-xs cursor-pointer" key={board.id} onClick={() => handleMoveToBoard({ boardId: board.id })}>
            <div className="flex items-start gap-3 text-muted-foreground">
              <div className="grid gap-0.5">
                <p className="truncate">{board.name}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
