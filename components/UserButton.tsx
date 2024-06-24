"use client";

import { LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import UserAvatar from "./UserAvatar";

export default function UserButton() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar userImage={user?.image || ""} className="ml-1.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-68 space-y-1 py-2" align="end">
        <DropdownMenuLabel className="flex items-center">
          <UserAvatar userImage={user?.image || ""} className="mr-2 size-6" />

          <div className="flex flex-col truncate">
            <span className="font-semibold"> {user?.name}</span>
            <span className="text-sm font-extralight">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer py-2" onClick={() => signOut()}>
          <LogOut size={16} className="mr-2 w-6" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
