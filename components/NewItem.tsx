import { useState } from "react";
import { Icons } from "@/assets/Icons";
import { useStore } from "@/store/store";

interface Props {
  onChange: (id: string, content: string) => void;
  closeModal: () => void;
  addItem: (listId: string, content: string) => void;
  listId: string;
}

export default function NewItem({ closeModal, addItem, listId }: Props) {
  const [value, setValue] = useState("");

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
  }

  function onBlur() {
    if (value !== "") {
      addItem(listId, value);
      setValue("");
      closeModal();

      // scrollToBottomof the list
    } else {
      closeModal();
    }
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (value.trim() !== "" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addItem(listId, value);
      setValue("");
      // closeModal();
    }
    if (value === "" && e.key === "Escape") {
      closeModal();
    }
  }

  return (
    <div className="bg-neutral-800 py-1 ring-1  ring-neutral-700 ring-inset w-full items-center rounded-lg relative group mt-[0.15rem] flex border-0 rounded-t-md dark:bg-neutral-900">
      <textarea
        className="h-20 max-w-[92%] w-full pt-2 resize-none placeholder:text-neutral-400 pl-4 border-none rounded bg-transparent text-white focus:outline-none cursor-text"
        value={value}
        autoFocus
        placeholder={`New Item`}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onFocus={(e) => {
          let prev = e.target.value;
          e.target.value = "";
          e.target.value = prev;
        }}
      />
      {/* {
        <button
          onClick={() => {
            closeModal();
          }}
          className="absolute  top-2 right-2 group-hover:inline-flex hidden"
        >
          <Icons.xIcon className="w-3 h-3 text-neutral-400 hover:text-red-500 transition duration-300" />
        </button>
      } */}
    </div>
  );
}
