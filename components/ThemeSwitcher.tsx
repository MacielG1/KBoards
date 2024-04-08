import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  function onClick() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }
  return (
    <Button type="button" onClick={onClick} variant="ghost" size="icon" className="z-[9999] h-9 w-9 duration-100">
      <Moon className="block dark:hidden" height="20" />
      <Sun className="hidden dark:block" height="20" />
    </Button>
  );
}
