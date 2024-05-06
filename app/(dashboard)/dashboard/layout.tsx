import Navigation from "@/components/Navigation";
import SidebarParent from "@/components/Sidebar/SidebarParent";
import TopBar from "@/components/TopBar/TopBar";

export const dynamic = "force-dynamic";

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full">
      <Navigation SidebarParent={<SidebarParent />} />
      <main className="relative flex flex-1 flex-grow">
        <TopBar />
        <div className="h-full flex-grow pt-14">{children}</div>
      </main>
    </div>
  );
}
