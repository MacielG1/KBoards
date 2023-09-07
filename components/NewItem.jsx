'use client';
import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { useStore } from '@/store/store';
import ListItems from './ListItems';

export default function NewItem() {
  let [value, setValue] = useState('');
  let [items, setItems] = useState([
    {
      id: 1,
      text: 'item 1',
    },
  ]);

  function handleInputChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!value) return;
    setItems([...items, { id: Math.random(), text: value }]);
    setValue('');
  }

  return (
    <>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input onChange={handleInputChange} value={value} />
        <Button type="submit">Add</Button>
      </form>
      <ListItems className="flex gap-2" items={items} setItems={setItems} />
    </>
  );
}
