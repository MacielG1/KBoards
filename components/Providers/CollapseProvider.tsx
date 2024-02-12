"use client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type ContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (boolean: boolean) => void;
};

const CollapseContext = createContext<ContextType>({
  isCollapsed: false,
  setIsCollapsed: (boolean: boolean) => boolean,
});

function CollapseProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage("isCollapsed", true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <CollapseContext.Provider value={{ isCollapsed, setIsCollapsed }}>{children}</CollapseContext.Provider>;
}

export { CollapseProvider };

export const useCollapsedContext = () => useContext(CollapseContext);
