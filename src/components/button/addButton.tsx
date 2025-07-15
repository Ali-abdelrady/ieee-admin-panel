import React from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AddButtonProps extends React.ComponentPropsWithRef<"button"> {
  label?: string;

  linkUrl?: string;
    hasAddWord?: boolean;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
    ({label, hasAddWord, linkUrl = "", ...props}, ref) => {
    // Optional: skip rendering until mounted
    const isMobile = useMediaQuery("(max-width: 768px)");
        const displayLabel = `${hasAddWord ? "" : "Add "}${label}`;
    return (
      <Button
        ref={ref}
        {...props}
        className="ml-auto capitalize "
        asChild={linkUrl !== ""}
        variant={isMobile ? "ghost" : "default"}
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
