import React from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";

interface EditButtonProps extends React.ComponentPropsWithRef<"button"> {
  label?: string;
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ label, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant="outline"
        size="icon"
        aria-label={`Edit ${label}`}
      >
        <SquarePen />
      </Button>
    );
  }
);

EditButton.displayName = "EditButton";

export default EditButton;
