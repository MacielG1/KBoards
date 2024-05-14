import { useStore } from "@/store/store";
import { cn } from "@/utils";
import { updateBoardBackgroundColor } from "@/utils/actions/boards/updateBoardBackgroundColor";
import { updateBoardColor } from "@/utils/actions/boards/updateBoardColor";
import { updateItemColor } from "@/utils/actions/items/updateItemColor";
import { updateListColor } from "@/utils/actions/lists/updateListColor";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ColorPickerProps = {
  id: string;
  value: string;
  type: string;
  className?: string;
  text?: string;
  setter: React.Dispatch<React.SetStateAction<string>>;
};

export default function ColorPicker({ id, value, type, text = "Change Color", className, setter }: ColorPickerProps) {
  const params = useParams<{ boardId: string }>();
  const [isMounted, setIsMounted] = useState(false);

  const setListColor = useStore((state) => state.setListColor);
  const setBoardColor = useStore((state) => state.setBoardColor);
  const setBoardBackgroundColor = useStore((state) => state.setBoardBackgroundColor);
  const setItemColorState = useStore((state) => state.setItemColor);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(async () => {
      if (type === "list") setListColor(id, value, params.boardId);
      else if (type === "board") setBoardColor(id, value);
      else if (type === "background") setBoardBackgroundColor(id, value);
      else if (type === "item") setItemColorState(id, value, params.boardId);
    }, 50);

    const timer2 = setTimeout(async () => {
      if (type === "list") await updateListColor({ id: id, color: value, boardId: params.boardId });
      else if (type === "board") await updateBoardColor({ id: id, color: value });
      else if (type === "background") await updateBoardBackgroundColor({ id: id, backgroundColor: value });
      else if (type === "item") await updateItemColor({ id: id, color: value, boardId: params.boardId });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, value, setListColor, setBoardColor, setBoardBackgroundColor, type, params.boardId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  if (!isMounted) return null;
  return (
    <>
      <input
        className={cn(
          "peer mr-[0.4rem] h-6 w-5 min-w-[1rem] shrink-0 cursor-pointer rounded-full border-0 bg-transparent outline-none transition duration-100 focus-visible:scale-110 focus-visible:outline-none focus-visible:outline-4",
          className,
        )}
        type="color"
        value={value || getComputedStyle(document.documentElement).getPropertyValue(`--list-default`)}
        onChange={handleChange}
        id={`${type}-${id}`}
      />
      <label htmlFor={`${type}-${id}`} className="flex cursor-pointer items-center justify-start py-2  ">
        {text}
      </label>
    </>
  );
}
