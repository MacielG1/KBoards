// Server Component passed as prop to a Client Component to render as Children

import { fetchBoards } from "@/utils/data/fetchBoards";
import Sidebar from "./Sidebar";

export default async function SidebarParent() {
  const boards = (await fetchBoards()) || [];

  return <Sidebar boards={boards} />;
}
