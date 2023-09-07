import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import Item from './Item';

export default function ListItems({ items, setItems }) {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement.
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(pointerSensor, touchSensor);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  console.log(items);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => handleDragEnd(e, setItems)}
    >
      {items?.length > 0 && (
        <SortableContext items={items}>
          <>
            <div className="mx-4 flex flex-col">
              {items?.map((i) => (
                <Item text={i.text} id={i.id} key={i.id} />
              ))}
            </div>
          </>
        </SortableContext>
      )}
    </DndContext>
  );
}
