"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";
import { KeyboardEventHandler, forwardRef } from "react";
import { useFormStatus } from "react-dom";

type FormTextAreaProps = {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement | undefined>;
  defaultValue?: string;
  rows?: number;
};

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ id, label, placeholder, required, disabled, rows, className, onBlur, onClick, onKeyDown, defaultValue }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div className="w-full">
        {label ? (
          <Label htmlFor={id} className="text-xs font-semibold text-neutral-700">
            {label}
          </Label>
        ) : null}
        <Textarea
          onKeyDown={onKeyDown}
          ref={ref}
          rows={rows}
          id={id}
          placeholder={placeholder}
          required={required}
          disabled={pending || disabled}
          className={cn(
            "focus-outline-0 resize-none border-0 bg-neutral-300 shadow-sm outline-none ring-0 focus:border-0 focus:ring-0 focus-visible:bg-[#e2e2e2] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-neutral-800 dark:focus-visible:bg-[#303030]",
            className,
          )}
          onBlur={onBlur}
          onClick={onClick}
          defaultValue={defaultValue}
          name={id}
        />
      </div>
    );
  },
);
FormTextArea.displayName = "FormTextArea";

export default FormTextArea;
