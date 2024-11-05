import Navigation from "@/components/Navigation";
import SidebarParent from "@/components/Sidebar/SidebarParent";
import { SubButtonParent } from "@/components/TopBar/SubButtonParent";
import Main from "./[boardId]/_components/Main";

export const dynamic = "force-dynamic";

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full">
      <Navigation SidebarParent={<SidebarParent />} />
      <Main SubButtonParent={<SubButtonParent />}>{children}</Main>
    </div>
  );
}
