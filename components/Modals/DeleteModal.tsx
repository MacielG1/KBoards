import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Trash2 } from "lucide-react";

type DeleteModalProps = {
  deleteHandler: () => void;
  message?: string;
  children: React.ReactNode;
};

export default function DeleteModal({ deleteHandler, message, children }: DeleteModalProps) {
  return (
    <Dialog>
      {/* <button className="px-[0.1rem] py-2 opacity-0 group-hover:opacity-100">
        <DialogTrigger asChild>
          <Trash2 className="size-4 text-neutral-500 hover:text-red-500 dark:text-neutral-300 dark:hover:text-red-400" />
        </DialogTrigger>
      </button> */}
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">{message}</DialogTitle>
          <DialogDescription>Are you sure you?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 justify-self-center pt-2">
          <DialogClose>
            <Button className="border border-neutral-600" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={(e) => {
              deleteHandler();
            }}
            className="bg-red-500 font-semibold hover:bg-red-600 dark:hover:bg-red-500/80"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
