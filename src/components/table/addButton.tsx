import React from "react";
import { Button } from "../ui/button";
import {Download, PlusIcon} from "lucide-react";

interface AddButtonProps extends React.ComponentPropsWithRef<"button"> {
  label: string;
    icon?: "add" | "download";
    addWord?: boolean;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
    ({label, addWord = true, className, icon = "add", ...props}, ref) => {
    return (
        <Button ref={ref} {...props} className={`ml-auto capitalize ${className}`}>
            {icon === "add" ? <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true"/> : <Download/>}
            {addWord ? "Add" : ""}
            {label}
      </Button>
    );
  }
);

AddButton.displayName = "AddButton";

export default AddButton;
