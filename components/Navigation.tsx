"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ElementRef } from "react";
import { cn } from "@/utils";
import { useMediaQuery } from "usehooks-ts";
import { ChevronsLeft, Menu } from "lucide-react";
import Sidebar from "./Sidebar/Sidebar";
import { useCollapsedContext } from "./Providers/CollapseProvider";
import type { Board } from "@prisma/client";

export default function Navigation({ boards }: { boards: Board[] }) {
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const isMobile = useMediaQuery("(max-width: 500px)");
  const [mounted, setMounted] = useState(false);

  const [isResetting, setIsResetting] = useState(false);
  const { isCollapsed, setIsCollapsed } = useCollapsedContext();

  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "208px";
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 208px)");
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "208px");
      setTimeout(() => setIsResetting(false), 300);
      localStorage.setItem("isCollapsed", JSON.stringify(false));
    }
  }, [isMobile, setIsCollapsed]);

  const collapse = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
      localStorage.setItem("isCollapsed", JSON.stringify(true));
    }
  }, [sidebarRef, navbarRef, setIsCollapsed, setIsResetting]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isCollapsed) {
      collapse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, collapse]);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar relative z-[9999] flex h-full flex-col overflow-x-hidden bg-neutral-200 dark:bg-neutral-800 `,
          isResetting && "transition-all duration-300 ease-in-out",
          isCollapsed && "w-0",
        )}
      >
        <div
          className={cn(
            `absolute right-2 top-[18px] h-6 w-6 rounded-sm text-neutral-500 transition hover:text-neutral-900 group-hover/sidebar:opacity-100 dark:text-neutral-500 dark:hover:text-neutral-300 md:opacity-0 md:hover:opacity-100`,
          )}
          role="button"
          onClick={collapse}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <Sidebar boards={boards} />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-3 z-[99999] w-[calc(100%-208px)] ",
          isCollapsed && "left-0 w-full",
          // isResetting && "transition-all ease-in-out",
          // isMobile && "left-0 w-full",
        )}
      >
        {isCollapsed && (
          <>
            <Menu
              role="button"
              className="absolute z-[99999] ml-2 mt-[5px] h-6 w-6 text-neutral-500  duration-200 hover:text-neutral-900 dark:hover:text-neutral-300"
              onClick={resetWidth}
            />
          </>
        )}
      </div>
    </div>
  );
}
