// import { useCallback, useEffect, useRef, useState } from "react";
// import { ElementRef } from "react";
// import { Icons } from "@/assets/Icons";
// import { cn } from "@/utils";
// import Sidebar from "./Sidebar";
// import { useMediaQuery } from "usehooks-ts";
// import { Menu } from "lucide-react";

// export default function Navigation() {
//   const sidebarRef = useRef<HTMLElement>(null);
//   const navbarRef = useRef<ElementRef<"div">>(null);
//   const isMobile = useMediaQuery("(max-width: 768px)");

//   const [isResetting, setIsResetting] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const resetWidth = useCallback(() => {
//     if (sidebarRef.current && navbarRef.current) {
//       setIsCollapsed(false);
//       setIsResetting(true);

//       sidebarRef.current.style.width = isMobile ? "100%" : "208px";
//       navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 208px)");
//       navbarRef.current.style.setProperty("left", isMobile ? "100%" : "208px");
//       setTimeout(() => setIsResetting(false), 300);
//     }
//   }, [isMobile]);

//   // useEffect(() => {
//   //   if (isMobile) {
//   //     collapse();
//   //   } else {
//   //     resetWidth();
//   //   }
//   // }, [isMobile, resetWidth]);

//   function collapse() {
//     if (sidebarRef.current && navbarRef.current) {
//       setIsCollapsed(true);
//       setIsResetting(true);

//       sidebarRef.current.style.width = "0";
//       navbarRef.current.style.setProperty("width", "100%");
//       navbarRef.current.style.setProperty("left", "0");
//       setTimeout(() => setIsResetting(false), 300);
//     }
//   }

//   return (
//     <div>
//       <aside
//         ref={sidebarRef}
//         className={cn(
//           `group/sidebar relative z-[99999] flex h-full flex-col overflow-y-auto bg-secondary`,
//           isResetting && "transition-all duration-300 ease-in-out",
//           // isMobile && "w-0",
//         )}
//       >
//         <div
//           className={cn(
//             `absolute right-2 top-3 h-6 w-6 rounded-sm text-neutral-950 opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:bg-neutral-600`,
//             // isMobile && "opacity-100",
//           )}
//           role="button"
//           onClick={collapse}
//         >
//           <Icons.chevronsLeft className="h-6 w-6 " />
//         </div>
//         <Sidebar />
//       </aside>

//       <div
//         ref={navbarRef}
//         className={cn(
//           "absolute left-60 top-3 z-[99999] w-[calc(100%-208px)] ",
//           isResetting && "transition-all ease-in-out",
//           // isMobile && "left-0 w-full"
//         )}
//       >
//         {isCollapsed && <Menu role="button" className="absolute h-6 w-6 pl-1 text-neutral-500" onClick={resetWidth} />}
//       </div>
//     </div>
//   );
// }
// import { useCallback, useEffect, useRef, useState } from "react";
// import { ElementRef } from "react";
// import { Icons } from "@/assets/Icons";
// import { cn } from "@/utils";
// import Sidebar from "./Sidebar";
// import { useMediaQuery } from "usehooks-ts";
// import { Menu } from "lucide-react";

// export default function Navigation() {
//   const sidebarRef = useRef<HTMLElement>(null);
//   const navbarRef = useRef<ElementRef<"div">>(null);
//   const isMobile = useMediaQuery("(max-width: 768px)");

//   const [isResetting, setIsResetting] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(true); // Change the default state to collapsed

//   const resetWidth = useCallback(() => {
//     if (sidebarRef.current && navbarRef.current) {
//       setIsCollapsed(false);
//       setIsResetting(true);

//       sidebarRef.current.style.width = isMobile ? "100%" : "208px";
//       navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 208px)");
//       navbarRef.current.style.setProperty("left", isMobile ? "100%" : "208px");
//       setTimeout(() => setIsResetting(false), 300);
//     }
//   }, [isMobile]);

//   useEffect(() => {
//     if (isMobile) {
//       collapse();
//     } else {
//       resetWidth();
//     }
//   }, [isMobile, resetWidth]);

//   function collapse() {
//     if (sidebarRef.current && navbarRef.current) {
//       setIsCollapsed(true);
//       setIsResetting(true);

//       sidebarRef.current.style.width = "0";
//       navbarRef.current.style.setProperty("width", "100%");
//       navbarRef.current.style.setProperty("left", "0");
//       setTimeout(() => setIsResetting(false), 300);
//     }
//   }

//   useEffect(() => {
//     // Ensure that the sidebar is collapsed on initial render
//     if (!isMobile) {
//       collapse();
//     }
//   }, [isMobile]);

//   return (
//     <div>
//       <aside
//         ref={sidebarRef}
//         className={cn(
//           `group/sidebar relative z-[99999] flex h-full flex-col overflow-y-auto bg-secondary`,
//           isResetting && "transition-all duration-300 ease-in-out",
//           isCollapsed && "w-0", // Adjusted for default collapsed state
//         )}
//       >
//         <div
//           className={cn(
//             `absolute right-2 top-3 h-6 w-6 rounded-sm text-neutral-950 opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:bg-neutral-600`,
//             isMobile && "opacity-100",
//           )}
//           role="button"
//           onClick={collapse}
//         >
//           <Icons.chevronsLeft className="h-6 w-6 " />
//         </div>
//         <Sidebar />
//       </aside>

//       <div
//         ref={navbarRef}
//         className={cn("absolute left-60 top-3 z-[99999] w-[calc(100%-208px)] ", isResetting && "transition-all ease-in-out", isMobile && "left-0 w-full")}
//       >
//         {isCollapsed && <Menu role="button" className="absolute h-6 w-6 pl-1 text-neutral-500" onClick={resetWidth} />}
//       </div>
//     </div>
//   );
// }

import { useCallback, useEffect, useRef, useState } from "react";
import { ElementRef } from "react";
import { cn } from "@/utils";
import Sidebar from "./Sidebar";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { ChevronsLeft, Menu } from "lucide-react";

export default function Navigation() {
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isResetting, setIsResetting] = useState(false);
  // const [isCollapsed, setIsCollapsed] = useState(() => {
  //   const storedState = localStorage.getItem("isCollapsed");
  //   return storedState !== null ? JSON.parse(storedState) : !isMobile;
  // });

  const [isCollapsed, setIsCollapsed] = useLocalStorage("isCollapsed", false);

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
  }, [isMobile]);

  // useEffect(() => {
  //   if (isMobile) {
  //     collapse();
  //   } else {
  //     resetWidth();
  //   }
  // }, [isMobile, resetWidth]);

  function collapse() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
      localStorage.setItem("isCollapsed", JSON.stringify(true));
    }
  }

  useEffect(() => {
    if (isCollapsed) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, isCollapsed, resetWidth]);

  return (
    <div>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar relative z-[99999] mr-5 flex   flex-col  overflow-x-hidden  bg-neutral-200 dark:bg-neutral-800`,
          isResetting && "transition-all duration-300 ease-in-out",
          isCollapsed && "w-0",
        )}
      >
        <div
          className={cn(
            `absolute right-2 top-3 h-6 w-6 rounded-sm text-neutral-500 opacity-0 transition hover:text-neutral-900 group-hover/sidebar:opacity-100 dark:text-neutral-500  dark:hover:text-neutral-300 `,
            // isMobile && "opacity-100",
          )}
          role="button"
          onClick={collapse}
        >
          {/* <ArrowBigLeftDash className="h-6 w-6 " /> */}
          <ChevronsLeft className="h-6 w-6 " />
        </div>
        <Sidebar />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-3 z-[99999] w-[calc(100%-208px)] ",
          isResetting && "transition-all ease-in-out",
          //  isMobile && "left-0 w-full"
        )}
      >
        {isCollapsed && (
          <Menu
            role="button"
            className="absolute h-6 w-6 pl-1 text-neutral-500  duration-200 hover:text-neutral-900 dark:hover:text-neutral-300"
            onClick={resetWidth}
          />
        )}
      </div>
    </div>
  );
}
