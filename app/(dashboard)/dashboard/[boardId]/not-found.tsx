import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid h-[80vh] w-full place-items-center">
      <div className="space-y-4 text-center">
        <h2>Board Not Found</h2>
        <Button asChild variant={"accent"}>
          <Link href="/dashboard">Go Back</Link>
        </Button>
      </div>
    </div>
  );
}
