"use client";

import { useProModalStore } from "@/store/useProModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { stripeRedirect } from "@/utils/actions/stripe/stripeRedirect";
import { toast } from "sonner";
import { useState } from "react";
import { BOARDS_LIMIT, CURRENT_PRICE, LISTS_LIMIT } from "@/utils/constants";

export default function PremiumModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, onClose] = useProModalStore((state) => [state.isOpen, state.onClose]);

  async function handleUpgrade() {
    setIsLoading(true);
    const res = await stripeRedirect();
    setIsLoading(false);
    if (res.error) {
      toast.error("An error occurred. Please try again later.");
    } else {
      window.location.href = res.data as string;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Upgrade to Premium</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>Unlock more features and support the app's development</DialogDescription>
        </DialogHeader>
        <p className="text-center text-green-400">
          <span className="text-4xl ">$ {(CURRENT_PRICE / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span> /mo
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[25px_1fr] items-center gap-4">
            <Check className="h-5 w-5 text-green-400" />
            <div>
              <p className="font-medium">Unlimited Boards</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create as many boards as you need ({BOARDS_LIMIT} in free plan)</p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-center gap-4">
            <Check className="h-5 w-5 text-green-400" />
            <div>
              <p className="font-medium">Unlimited Lists</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add as many lists as you want ({LISTS_LIMIT} in free plan)</p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-center gap-4">
            <Check className="h-5 w-5 text-green-400" />
            <div>
              <p className="font-medium">and more...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get access to new features early.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpgrade} variant="primary" disabled={isLoading}>
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
