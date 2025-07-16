import React from "react";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

interface PreviewButtonProps extends React.ComponentPropsWithRef<"button"> {
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

const PreviewButton = React.forwardRef<HTMLButtonElement, PreviewButtonProps>(
  ({ label, variant, asIcon = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant={variant}
        size={asIcon ? "icon" : "default"}
        aria-label={`Preview ${label}`}
      >
        {asIcon ? (
          <Eye />
        ) : (
          <>
            <Eye />
            {children}
          </>
        )}
      </Button>
    );
  }
);

PreviewButton.displayName = "PreviewButton";

export default PreviewButton;
