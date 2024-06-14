import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  function onClick() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="z-[9999] size-7 bg-neutral-200 transition-all duration-100 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-900"
    >
      <Moon className="block dark:hidden" height="18" />
      <Sun className="hidden dark:block" height="18" />
    </Button>
  );
}
