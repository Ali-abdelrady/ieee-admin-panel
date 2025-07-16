import React from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";

interface EditButtonProps extends React.ComponentPropsWithRef<"button"> {
  label?: string;
  isIcon?: boolean;
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ label, isIcon = true, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant="outline"
        size={isIcon ? "icon" : "default"}
        aria-label={`Edit ${label}`}
      >
        {label !== "" ? (
          <>
            <SquarePen /> {label}
          </>
        ) : (
          <SquarePen />
        )}
      </Button>
    );
  }
);

EditButton.displayName = "EditButton";

export default EditButton;
