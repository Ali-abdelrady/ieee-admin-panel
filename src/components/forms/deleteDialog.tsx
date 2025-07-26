import { CustomDialog } from "./customModal";
import DeleteButton from "../button/deleteButton";
import { toast } from "sonner";

type DeleteDialogProps<T, DeleteParams = string | number> = {
  rows: T | T[];
  isIcon?: boolean;
  deleteFn: (params: DeleteParams) => Promise<any>;
  getDeleteParams: (row: T) => DeleteParams;
  isLoading?: boolean;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive";
  trigger?: React.ReactNode;
  successMessage?: string | ((deletedCount: number) => string);
  errorMessage?: string;
};

export default function DeleteDialog<T, DeleteParams = string | number>({
  rows,
  isIcon = false,
  deleteFn,
  getDeleteParams,
  isLoading = false,
  variant = "outline",
  trigger,
  successMessage,
  errorMessage = "Couldn't delete selected rows",
}: DeleteDialogProps<T, DeleteParams>) {
  const rowsArr = Array.isArray(rows) ? rows : [rows];
  const rowCount = rowsArr.length;

  async function handleDeleteRows(): Promise<boolean> {
    try {
      if (rowsArr.length > 1) {
        await Promise.all(rowsArr.map((row) => deleteFn(getDeleteParams(row))));
      } else {
        await deleteFn(rowsArr[0].id);
      }

      const successMsg =
        typeof successMessage === "function"
          ? successMessage(rowCount)
          : successMessage ||
            `Successfully deleted ${rowCount} ${
              rowCount === 1 ? "item" : "items"
            }`;

      toast.success(successMsg, { duration: 3000 });
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong", {
        description: errorMessage,
        duration: 3000,
      });
      return false;
    }
  }

  return (
    <CustomDialog
      trigger={
        trigger ?? (
          <DeleteButton variant={variant} isIcon={isIcon} rowsCnt={rowCount} />
        )
      }
      title="Are you absolutely sure?"
      actionLabel="Delete"
      description={`This action cannot be undone. This will permanently delete ${rowCount} selected ${
        rowCount === 1 ? "item" : "items"
      }.`}
      onSubmit={handleDeleteRows}
      isLoading={isLoading}
    />
  );
}
