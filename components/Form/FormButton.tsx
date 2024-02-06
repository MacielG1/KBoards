"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonSizeProps, ButtonVariantProps } from "../ui/button";
import { cn } from "@/utils";

type FormButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariantProps;
  size?: ButtonSizeProps;
};

export default function FormButton({ children, className, disabled, size = "sm", variant = "primary" }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button size={size} className={cn(className)} type="submit" variant={variant} disabled={pending || disabled}>
      {children}
    </Button>
  );
}
