// Server Component passed as prop to a Client Component to render as Children

import { fetchBoards } from "@/utils/fetchBoards";
import Sidebar from "./Sidebar";
import { Suspense } from "react";
import PremiumCheck from "./PremiumCheck";

type SidebarParentProps = {};

export default async function SidebarParent({}: SidebarParentProps) {
  const boards = (await fetchBoards()) || [];

  return (
    <Sidebar 
      boards={boards} 
      SubscribeButton={
        <Suspense fallback={null}>
          <PremiumCheck />
        </Suspense>
      } 
    />
  );
}
