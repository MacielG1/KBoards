"use client";

import { useProModalStore } from "@/store/useProModal";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

export default function SubscribeButton() {
  const router = useRouter();
  const onOpen = useProModalStore(useShallow((state) => state.onOpen));


  const handleSubscribe = () => {
    onOpen();
  };

  return (
    <button 
      onClick={handleSubscribe}
      className="px-3 py-1.5 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors cursor-pointer"
    >
      Upgrade Now
    </button>
  );
} 