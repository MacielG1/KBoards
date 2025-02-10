"use client";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { stripeRedirect } from "@/utils/actions/stripe/stripeRedirect";
import { toast } from "sonner";
import { useProModalStore } from "@/store/useProModal";
import { useShallow } from "zustand/shallow";

export default function SubButton({ isPremium }: { isPremium: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  const onOpen = useProModalStore(useShallow((state) => state.onOpen));

  async function handleClick() {
    if (isPremium) {
      setIsLoading(true);
      const res = await stripeRedirect();
      setIsLoading(false);
      if (res.error) {
        toast.error("An error occurred. Please try again later.");
      } else {
        window.location.href = res.data as string;
      }
    } else {
      onOpen();
    }
  }

  return (
    <Button
      disabled={isLoading}
      variant="ghost"
      onClick={handleClick}
      className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal"
    >
      <ShieldCheck className={`mr-2 size-4 shrink-0`} />
      <span>{isPremium ? "Manage Subscription" : "Upgrade to Premium"}</span>
    </Button>
  );
}
