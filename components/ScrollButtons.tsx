// "use client";

// import { useStore } from "@/store/store";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { useState, useEffect } from "react";

// export default function ScrollButtons() {
//   const [canScroll, setCanScroll] = useState(false);
//   useEffect(() => {
//     const handleScroll = () => {
//       setTimeout(() => {
//         if (window.innerWidth < document.documentElement.scrollWidth) {
//           setCanScroll(true);
//         }
//       }, 50);
//       // now for horizontal scroll
//     };

//     window.addEventListener("resize", handleScroll);

//     handleScroll();

//     return () => {
//       window.removeEventListener("resize", handleScroll);
//     };
//   }, []);

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

//   return (
//     <>
//       <button
//         className={`${
//           canScroll ? "visible opacity-100" : "invisible opacity-0"
//         } fixed bottom-5 right-1 z-50 rounded-full bg-indigo-900 p-1 text-white transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-700 xl:right-5`}
//         onClick={handleScrollRight}
//       >
//         <ArrowRight className="h-4 w-4" />
//       </button>

//       <button
//         className={`${
//           canScroll ? "visible opacity-100" : "invisible opacity-0"
//         } fixed bottom-5 left-1 z-50 rounded-full bg-indigo-900 p-1 text-white transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-700 xl:left-5`}
//         onClick={handleScrollLeft}
//       >
//         <ArrowLeft className="h-4 w-4" />
//       </button>
//     </>
//   );
// }

"use client";

import { useStore } from "@/store/store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ScrollButtons() {
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const boards = useStore((state) => state.boards);

  useEffect(() => {
    console.log(boards);
    console.log("scroll buttons", boards.length);

    const handleScroll = () => {
      setTimeout(() => {
        console.log(window.innerWidth, document.documentElement.scrollWidth);
        if (window.innerWidth < document.documentElement.scrollWidth) {
          setCanScrollRight(true);
        } else {
          setCanScrollRight(false);
        }
      }, 50);
      // now for horizontal scroll
    };

    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [boards]);

  useEffect(() => {
    const handleScroll = () => {
      setTimeout(() => {
        // get scroll position
        if (window.scrollX > 210) {
          setCanScrollLeft(true);
        } else {
          setCanScrollLeft(false);
        }
      }, 50);
      // now for horizontal scroll
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  return (
    <>
      <button
        className={`${
          canScrollRight ? "visible opacity-100" : "invisible opacity-0"
        } fixed bottom-5 right-1 z-[99999] rounded-full bg-indigo-900 p-1 text-white transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-700 xl:right-5`}
        onClick={handleScrollRight}
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      <button
        className={`${
          canScrollLeft ? "visible opacity-100" : "invisible opacity-0"
        } fixed bottom-5 left-1 z-[99999] rounded-full bg-indigo-900 p-1 text-white transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-700 xl:left-5`}
        onClick={handleScrollLeft}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
    </>
  );
}
