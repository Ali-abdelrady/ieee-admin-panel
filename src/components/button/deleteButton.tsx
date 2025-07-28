import React from "react";
import { Button } from "../ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteButtonProps extends React.ComponentPropsWithRef<"button"> {
  className?: string;
  label?: string;
  isIcon?: boolean;
  rowsCnt?: number;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive";
}

const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
  (
    {
      className,
      label,
      isIcon = false,
      rowsCnt = 0,
      variant = "outline",
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={cn(`${isIcon ? "" : "ml-auto capitalize"}`, className)}
        aria-label={`Delete ${label}`}
        size={isIcon ? "icon" : "default"}
        variant={variant}
      >
        <Trash2 className="text-inherit" />
        {!isIcon && `Delete `}
        {rowsCnt != 0 && !isIcon && (
          <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {rowsCnt}
          </span>
        )}
      </Button>
    );
  }
);

DeleteButton.displayName = "DeleteButton";

export default DeleteButton;
