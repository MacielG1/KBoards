import Image from "next/image";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className}>
      <p className="flex items-center justify-center gap-1 transition">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <span className="hidden pb-1 text-2xl text-neutral-300 sm:block">KBoards</span>
      </p>
    </Link>
  );
}
