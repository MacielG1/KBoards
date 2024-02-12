import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRef } from "react";

type DeleteModalProps = {
  deleteHandler: () => void;
  message?: string;
  children: React.ReactNode;
};

export default function DeleteModal({ deleteHandler, message, children }: DeleteModalProps) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-[350px] sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">{message}</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 justify-self-center pt-2">
          <DialogClose ref={ref}>
            <Button asChild className="border border-neutral-600" variant="ghost">
              <span>Cancel</span>
            </Button>
          </DialogClose>
          <Button
            asChild
            onClick={(e) => {
              e.stopPropagation();
              deleteHandler();
              ref.current?.click();
            }}
            className="cursor-pointer bg-red-500 font-semibold hover:bg-red-600 dark:hover:bg-red-500/80"
          >
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
