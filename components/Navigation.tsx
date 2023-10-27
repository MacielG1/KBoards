import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ElementRef } from "react";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Sidebar from "./Sidebar";
import { Icons } from "@/assets/Icons";
import TopBar from "./TopBar";

export default function Navigation() {
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  function resetWidth() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  function collapse() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]`,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
        )}
      >
        <div
          className={cn(
            `h-6 w-6 text-neutral-950 rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,
            isMobile && "opacity-100",
          )}
          role="button"
          onClick={collapse}
        >
          <Icons.chevronsLeft className="h-6 w-6 " />
        </div>
        <Sidebar />
      </aside>
      <div
        ref={navbarRef}
        className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)] ", isResetting && "transition-all ease-in-out", isMobile && "left-0 w-full")}
      >
        {isCollapsed && <Icons.chevronsRight role="button" className="h-6 w-6 absolute text-neutral-500" onClick={resetWidth} />}
        <nav className="bg-transparent px-3 pt-3 w-full">
          <div className="text-neutral-200 text-center ">
            <TopBar />
          </div>
        </nav>
      </div>
    </>
  );
}
