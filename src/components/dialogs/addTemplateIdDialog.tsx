import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { boolean } from "zod";
import { toast } from "sonner";

interface AddNewItemDialog {
  onAdd: (newId: string) => boolean;

  trigger: React.ReactNode;
}
export default function AddNewItemDialog({ onAdd, trigger }: AddNewItemDialog) {
  const [fieldContent, setFieldContent] = useState("");
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item ID 🆔</DialogTitle>
          <DialogDescription>The Id must be unique</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="id" className="sr-only">
              Unique ID
            </Label>
            <Input
              id="id"
              value={fieldContent}
              placeholder="Enter Unique Id"
              onChange={(e) => {
                setFieldContent(e.target.value);
              }}
              required
            />
            {isError && (
              <p className="text-red-500">This id is already exist</p>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              const result = onAdd(fieldContent);
              if (result) {
                setOpen(false);
                setIsError(false);
              } else {
                setIsError(true);
              }
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
