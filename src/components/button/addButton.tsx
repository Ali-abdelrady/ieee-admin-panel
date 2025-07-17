import React from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface AddButtonProps extends React.ComponentPropsWithRef<"button"> {
  label?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive";
  linkUrl?: string;
  hasAddWord?: boolean;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  (
    {
      label,
      hasAddWord,
      linkUrl = "",
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    // Optional: skip rendering until mounted
    const isMobile = useMediaQuery("(max-width: 768px)");
    const displayLabel = `${hasAddWord ? "" : "Add "}${label}`;
    return (
      <Button
        ref={ref}
        {...props}
        className={cn("capitalize", className)}
        asChild={linkUrl !== ""}
        // variant={isMobile ? "ghost" : "default"}
        variant={variant}
      >
        {linkUrl !== "" ? (
          <Link href={linkUrl}>
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add {label}
          </Link>
        ) : (
          <>
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {displayLabel}
          </>
        )}
      </Button>
    );
  }
);

AddButton.displayName = "AddButton";

export default AddButton;
