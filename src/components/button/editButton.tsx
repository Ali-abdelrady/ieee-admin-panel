import React from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";

interface EditButtonProps extends React.ComponentPropsWithRef<"button"> {
  label: string;
  asIcon?: boolean;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive";
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ label, asIcon = false, variant = "default", children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant={variant}
        size={asIcon ? "icon" : "default"}
        aria-label={`Edit ${label}`}
      >
        {asIcon ? (
          <SquarePen />
        ) : (
          <>
            <SquarePen />
            {children}
          </>
        )}
      </Button>
    );
  }
);

EditButton.displayName = "EditButton";

export default EditButton;
