"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStore, useSearchHighlight } from "@/store/store";
import { Search, FileText, LayoutList, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type SearchResult = {
  type: "board" | "list" | "item";
  id: string;
  title: string;
  boardId: string;
  boardName: string;
  listName?: string;
  checked?: boolean | null;
};

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const orderedBoards = useStore(useShallow((state) => state.orderedBoards));
  const setHighlight = useSearchHighlight((state) => state.setHighlight);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Build search index from all boards
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    orderedBoards.forEach((board) => {
      // Search board names
      if (board.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "board",
          id: board.id,
          title: board.name,
          boardId: board.id,
          boardName: board.name,
        });
      }

      // Search lists and items
      board.lists?.forEach((list) => {
        if (list.title.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: "list",
            id: list.id,
            title: list.title,
            boardId: board.id,
            boardName: board.name,
          });
        }

        list.items?.forEach((item) => {
          if (item.content.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: "item",
              id: item.id,
              title: item.content,
              boardId: board.id,
              boardName: board.name,
              listName: list.title,
              checked: item.checked,
            });
          }
        });
      });
    });

    return results.slice(0, 20); // Limit results
  }, [query, orderedBoards]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setHighlight(result.id, result.type);
      router.push(`/dashboard/${result.boardId}`);
      setOpen(false);
      setQuery("");
    },
    [router, setHighlight],
  );

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
        title="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[80vh] overflow-hidden p-0 sm:max-w-[550px]">
          <VisuallyHidden>
            <DialogTitle>Search</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search boards, lists, and items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-12 w-full border-0 bg-transparent py-3 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {query && searchResults.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
            )}

            {searchResults.length > 0 && (
              <div className="p-2">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-700">
                      {result.type === "board" && <LayoutList className="h-4 w-4" />}
                      {result.type === "list" && <FileText className="h-4 w-4" />}
                      {result.type === "item" && <CheckSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className={`truncate font-medium ${result.checked ? "line-through opacity-60" : ""}`}>{result.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {result.type === "board" && "Board"}
                        {result.type === "list" && `List in ${result.boardName}`}
                        {result.type === "item" && `${result.listName} → ${result.boardName}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <p>Start typing to search across all your boards...</p>
                <p className="mt-2 text-xs">
                  <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs dark:bg-neutral-700">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs dark:bg-neutral-700">K</kbd>
                  <span className="ml-2">to open search</span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
