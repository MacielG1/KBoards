"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonVariantProps } from "../ui/button";
import { cn } from "@/utils";

type FormButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariantProps;
};

export default function FormButton({ children, className, disabled, variant = "primary" }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" className={cn(className)} type="submit" variant={variant} disabled={pending || disabled}>
      {children}
    </Button>
  );
}
