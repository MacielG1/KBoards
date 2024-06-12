"use client";

import { cn } from "@/utils";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

type FormInputProps = {
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, maxLength, type, placeholder, required, disabled, className, defaultValue, onBlur }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled || pending}
          className={cn(
            `h-8 w-full rounded-md bg-transparent px-2 py-0.5 text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:dark:bg-neutral-600`,
            className,
          )}
          defaultValue={defaultValue}
          maxLength={maxLength}
          ref={ref}
          onBlur={onBlur}
        />
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
