import React from "react";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

interface PreviewButtonProps extends React.ComponentPropsWithRef<"button"> {
  label?: string;
}

const PreviewButton = React.forwardRef<HTMLButtonElement, PreviewButtonProps>(
  ({ label, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant="outline"
        size="icon"
        aria-label={`Preview ${label}`}
      >
        <Eye />
      </Button>
    );
  }
);

PreviewButton.displayName = "PreviewButton";

export default PreviewButton;
