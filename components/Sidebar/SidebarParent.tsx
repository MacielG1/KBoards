// Server Component passed as prop to a Client Component to render as Children

import { fetchBoards } from "@/utils/fetchBoards";
import Sidebar from "./Sidebar";

export default async function SidebarParent() {
  const boards = (await fetchBoards()) || [];

  return <Sidebar boards={boards} />;
}
