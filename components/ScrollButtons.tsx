// "use client";

// import { useStore } from "@/store/store";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { useState, useEffect, useRef } from "react";

// export default function ScrollButtons() {
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);

//   const lists = useStore((state) => state.lists);

//   useEffect(() => {
//     const handleScroll = () => {
//       setTimeout(() => {
//         if (window.scrollX + window.innerWidth < document.documentElement.scrollWidth) {
//           setCanScrollRight(true);
//         } else {
//           setCanScrollRight(false);
//         }
//       }, 50);
//     };

//     window.addEventListener("resize", handleScroll);
//     window.addEventListener("scroll", handleScroll);

//     handleScroll();

//     return () => {
//       window.removeEventListener("resize", handleScroll);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lists]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setTimeout(() => {
//         if (window.scrollX > 10) {
//           setCanScrollLeft(true);
//         } else {
//           setCanScrollLeft(false);
//         }
//       }, 50);
//     };

//     window.addEventListener("scroll", handleScroll);

//     handleScroll();

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lists]);

//   const handleScrollRight = () => {
//     window.scrollBy({
//       left: window.innerWidth,
//       behavior: "smooth",
//     });
//   };

//   const handleScrollLeft = () => {
//     window.scrollBy({
//       left: -window.innerWidth,
//       behavior: "smooth",
//     });
//   };
//   const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const isHeldRef = useRef(false);

//   const handleMouseDown = (direction: number) => {
//     isHeldRef.current = false;
//     holdTimeoutRef.current = setTimeout(() => {
//       isHeldRef.current = true;
//       window.scrollBy({
//         left: direction * document.documentElement.scrollWidth,
//         behavior: "smooth",
//       });
//     }, 300);
//   };

//   const handleMouseUp = (direction: number) => {
//     if (holdTimeoutRef.current) {
//       clearTimeout(holdTimeoutRef.current);
//       holdTimeoutRef.current = null;
//     }
//     if (!isHeldRef.current) {
//       window.scrollBy({
//         left: direction * window.innerWidth,
//         behavior: "smooth",
//       });
//     }
//   };
//   return (
//     <>
//       <button
//         className={`${
//           canScrollRight ? "visible opacity-100" : "invisible opacity-0"
//         } fixed bottom-5 right-1 z-[99999] rounded-full bg-mainColor p-1 text-black transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-teal-600 xl:right-5`}
//         onClick={handleScrollRight}
//         onMouseDown={() => handleMouseDown(1)}
//         onMouseUp={() => handleMouseUp(1)}
//       >
//         <ArrowRight className="h-4 w-4" />
//       </button>

//       <button
//         className={`${
//           canScrollLeft ? "visible opacity-100" : "invisible opacity-0"
//         } fixed bottom-5 left-1 z-[99999] rounded-full bg-mainColor p-1 text-black transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-teal-600 xl:left-5`}
//         onClick={handleScrollLeft}
//         onMouseDown={() => handleMouseDown(-1)}
//         onMouseUp={() => handleMouseUp(-1)}
//       >
//         <ArrowLeft className="h-4 w-4" />
//       </button>
//     </>
//   );
// }
"use client";

import { useStore, useStorePersisted } from "@/store/store";
import { debounce } from "@/utils/debounce";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function ScrollButtons() {
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const currentBoardId = useStorePersisted((state) => state.currentBoardId);
  const params = useParams<{ boardId: string }>();
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHeldRef = useRef(false);

  const lists = useStore((state) => state.lists);

  const handleScroll = debounce(() => {
    const scrollX = window.scrollX;
    const innerWidth = window.innerWidth;
    const scrollWidth = document.documentElement.scrollWidth;

    setCanScrollRight(scrollX + innerWidth < scrollWidth);

    setCanScrollLeft(scrollX > 10);
  }, 50);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // add event listener to the body

    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [lists, handleScroll]);

  const handleScrollRight = () => {
    window.scrollBy({
      left: window.innerWidth,
      behavior: "smooth",
    });
  };

  const handleScrollLeft = () => {
    window.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth",
    });
  };
  const handleMouseDown = (direction: number) => {
    isHeldRef.current = false;
    holdTimeoutRef.current = setTimeout(() => {
      isHeldRef.current = true;
      window.scrollBy({
        left: direction * document.documentElement.scrollWidth,
        behavior: "smooth",
      });
    }, 300);
  };

  const handleMouseUp = (direction: number) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (!isHeldRef.current) {
      window.scrollBy({
        left: direction * window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <button
        className={`${
          canScrollRight ? "visible opacity-100" : "hidden"
        } fixed bottom-10 right-2 z-[99999] rounded-full bg-mainColor p-1 text-black transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-teal-600 xl:right-5`}
        onClick={handleScrollRight}
        onMouseDown={() => handleMouseDown(1)}
        onMouseUp={() => handleMouseUp(1)}
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      <button
        className={`${
          canScrollLeft ? "visible opacity-100" : "hidden"
        } fixed bottom-10 left-2 z-[99999] rounded-full bg-mainColor p-1 text-black transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-teal-600 xl:left-5`}
        onClick={handleScrollLeft}
        onMouseDown={() => handleMouseDown(-1)}
        onMouseUp={() => handleMouseUp(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
    </>
  );
}
