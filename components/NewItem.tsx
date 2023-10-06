import { useState } from "react";
import { ItemType } from "@/utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icons } from "@/assets/Icons";

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
    if (value) {
      console.log(value);
      addItem(listId, value);
      setValue("");
    } else {
      closeModal();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (value && e.key === "Enter") {
      e.preventDefault();
      addItem(listId, value);
      setValue("");
    }
  }

  return (
    <div className="bg-neutral-800 py-1 ring-1 ring-neutral-700 ring-inset w-full text-left rounded-xl relative group mt-[0.15rem] flex border-0 rounded-t-md dark:bg-neutral-900">
      <textarea
        className="h-[100%] max-w-[92%]  w-full resize-none placeholder:text-neutral-400 pl-4 border-none rounded bg-transparent text-white focus:outline-none cursor-text"
        value={value}
        autoFocus
        placeholder="Item"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onFocus={(e) => {
          let prev = e.target.value;
          e.target.value = "";
          e.target.value = prev;
        }}
      />
      {
        <button
          onClick={() => {
            closeModal();
          }}
          className="absolute top-2 right-2 group-hover:inline-flex hidden"
        >
          <Icons.trashIcon className="w-5 h-5 text-neutral-600 hover:text-red-500 transition duration-300" />
        </button>
      }
    </div>
  );
}
