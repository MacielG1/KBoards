import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ElementRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
// import Sidebar from "./Sidebar";
import { Icons } from "@/assets/Icons";
import TopBar from "./TopBar";
import { cn } from "@/utils";

export default function Navigation() {
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, resetWidth]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

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
          `group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary`,
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0",
        )}
      >
        <div
          className={cn(
            `absolute right-2 top-3 h-6 w-6 rounded-sm text-neutral-950 opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:bg-neutral-600`,
            isMobile && "opacity-100",
          )}
          role="button"
          onClick={collapse}
        >
          <Icons.chevronsLeft className="h-6 w-6 " />
        </div>
        {/* <Sidebar /> */}
      </aside>
      <div
        ref={navbarRef}
        className={cn("absolute left-60 top-3 z-[99999] w-[calc(100%-240px)] ", isResetting && "transition-all ease-in-out", isMobile && "left-0 w-full")}
      >
        {isCollapsed && <Icons.chevronsRight role="button" className="absolute h-6 w-6 text-neutral-500" onClick={resetWidth} />}
        <nav className="w-full bg-transparent px-3 pt-3">
          <div className="text-center text-neutral-200 ">
            <TopBar />
          </div>
        </nav>
      </div>
    </>
  );
}
