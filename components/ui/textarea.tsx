import * as React from "react";

import { cn } from "@/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  const texteAreaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => texteAreaRef.current as HTMLTextAreaElement);

  React.useEffect(() => {
    const ref = texteAreaRef?.current;

    const updateTextareaHeight = () => {
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = ref?.scrollHeight + "px";
      }
    };

    updateTextareaHeight();
    ref?.addEventListener("input", updateTextareaHeight);

    return () => ref?.removeEventListener("input", updateTextareaHeight);
  }, []);

  return (
    <textarea
      className={cn(
        "flex min-h-[20px] w-full overflow-y-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={texteAreaRef}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
