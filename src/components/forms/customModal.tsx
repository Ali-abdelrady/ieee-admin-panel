"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/services/store/store";
import { resetCloseAll } from "@/services/store/features/dialogSlice";

export interface CustomDialogRef {
  openDialog: () => void;
  closeDialog: () => void;
}

interface CustomDialogProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  actionLabel?: string;
  isLoading: boolean;
  onSubmit?: () => Promise<boolean>;
  isFullWidth?: boolean;
}

export const CustomDialog = forwardRef<CustomDialogRef, CustomDialogProps>(
  (
    {
      trigger,
      title,
      description,
      children,
      actionLabel = "",
      isLoading,
      onSubmit,
      isFullWidth = false,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch();
    const forceCloseAll = useSelector(
      (state: RootState) => state.dialog.forceCloseAll
    );

    useEffect(() => {
      if (forceCloseAll && open) {
        setOpen(false);
        dispatch(resetCloseAll());
      }
    }, [forceCloseAll, open]);
    const handleSubmit = async () => {
      if (!onSubmit) {
        console.warn("No onSubmit handler provided");
        return;
      }

      try {
        console.log("Starting submission...");
        const result = await onSubmit();
        console.log("Submission result:", result);

        if (result) {
          console.log("Success - closing dialog");
          setOpen(false);
        } else {
          console.log("Operation failed - keeping dialog open");
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    };

    // 🪄 expose methods via ref
    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
      closeDialog: () => setOpen(false),
    }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {/* ✅ optional trigger */}
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {/* <DialogOverlay className="bg-white shadow-lg" /> */}
        <DialogContent
          className={
            !isFullWidth
              ? `w-full max-h-[90vh] overflow-y-auto `
              : "sm:max-w-3xl overflow-auto"
          }
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {children && <div className="py-4 overflow-auto">{children}</div>}
          {/* {children} */}

          <DialogFooter>
            <DialogClose asChild ref={closeRef.current}>
              <Button variant="outline">
                {actionLabel ? "Cancel" : "Done"}
              </Button>
            </DialogClose>
            {actionLabel && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? `${actionLabel}...` : `${actionLabel}`}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

CustomDialog.displayName = "CustomDialog";
