import { cn } from "@/utils/cn";
import { ReactNode } from "react";

export type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  children: ReactNode;
};

export default function Button({ children, className, ref, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-lg border border-blue-800 bg-blue-700 px-4 py-2 text-gray-100 transition duration-300 hover:border-blue-950 hover:bg-blue-800 hover:text-gray-200 disabled:border-neutral-600 disabled:bg-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-gray-200 dark:disabled:border-neutral-600 dark:disabled:bg-neutral-900 focus:outline-none",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
}
