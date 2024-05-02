import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full justify-center pt-10">
      <Loader2 className="animate-spin text-teal-300" />
    </div>
  );
}
