import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <p className="flex items-center gap-2 transition ">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <span className="hidden text-xl text-neutral-300 sm:block ">KBoards</span>
      </p>
    </Link>
  );
}
