import { useStore } from "@/store/store";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

type ColorPickerProps = {
  id: string;
  value: string;
  type: string;
  className?: string;
  text?: string;
};

export default function ColorPicker({ id, value, type, text = "Change Color", className }: ColorPickerProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const currentBoardId = useStore((state) => state.currentBoardId);
  const setListColor = useStore((state) => state.setListColor);
  const setBoardColor = useStore((state) => state.setBoardColor);
  const setBoardBackgroundColor = useStore((state) => state.setBoardBackgroundColor);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type === "list") {
        setListColor(id, debouncedValue, currentBoardId);
      } else if (type === "board") {
        setBoardColor(id, debouncedValue);
      } else if (type === "background") {
        setBoardBackgroundColor(id, debouncedValue);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [id, debouncedValue, setListColor, setBoardColor, setBoardBackgroundColor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  return (
    <>
      <input
        className={cn(
          "peer mr-[0.4rem] h-6 w-5 min-w-[1rem] shrink-0 cursor-pointer rounded-full border-0 bg-transparent outline-none focus-visible:scale-110 focus-visible:outline-none",
          className,
        )}
        type="color"
        value={value}
        onChange={handleChange}
        id="color"
      />
      <label htmlFor="color" className="flex cursor-pointer items-center justify-start  ">
        {text}
      </label>
    </>
  );
}
