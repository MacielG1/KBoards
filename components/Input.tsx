import { cn } from '@/utils/cn';

export type InputProps = React.ComponentPropsWithRef<'input'>;

export default function Input({ className, type, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'min-w[1rem] w-[65vw] rounded-md border-2 border-neutral-600 bg-neutral-300 px-3 text-lg text-neutral-900 placeholder-neutral-700 transition-colors duration-300 placeholder:text-base hover:bg-neutral-200 focus:border-gray-600 focus:placeholder-neutral-500 focus-visible:border-[3px] focus-visible:border-neutral-900 focus-visible:bg-neutral-200 focus-visible:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-400 dark:hover:bg-black dark:focus:border-gray-500 dark:focus:placeholder-neutral-500 dark:focus-visible:border-neutral-700 dark:focus-visible:bg-neutral-950 md:w-[30rem] ',
        className
      )}
      ref={ref}
      {...props}
    />
  );
}
