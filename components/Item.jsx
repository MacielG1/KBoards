'use client';
import { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// import { Icons } from '@/assets/Icons';

export default function Item({ text, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDraggingItem, setIsDragging] = useState(false);
  const [isSortingItem, setIsSorting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id, disabled: isModalOpen });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging]);

  useEffect(() => {
    setIsSorting(isSorting);
  }, [isSorting]);

  return (
    <div
      className="mt-2 outline-none"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col items-center justify-center space-y-2 border border-neutral-500 max-w-md">
        <h2 className="h-11 max-w-[15rem] overflow-hidden whitespace-normal break-words pt-1 text-center text-sm font-normal text-black dark:text-white md:max-w-[19rem]">
          <span className="cursor-pointer">{text}</span>
        </h2>
      </div>
    </div>
  );
}
