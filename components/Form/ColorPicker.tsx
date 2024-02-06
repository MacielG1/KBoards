import { useStore } from "@/store/store";
import { useEffect, useState } from "react";

type ColorPickerProps = {
  id: string;
  value: string;
  setter: (id: string, value: string) => void;
};

export default function ColorPicker({ id, value, setter }: ColorPickerProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // const setColor = useStore((state) => state.setListColor);

  useEffect(() => {
    const timer = setTimeout(() => {
      setter(id, debouncedValue);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [id, debouncedValue, setter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  return (
    <>
      <input
        className="peer h-6 w-5 min-w-[1rem] cursor-pointer rounded-full border-0 bg-transparent outline-none focus-visible:scale-110 focus-visible:outline-none "
        type="color"
        value={value}
        onChange={handleChange}
        id="color"
      />
      <label htmlFor="color" className="flex cursor-pointer items-center justify-start pl-[0.4rem]">
        Change Color
      </label>
    </>
  );
}
