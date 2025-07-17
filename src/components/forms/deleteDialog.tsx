import { CustomDialog } from "./customModal";
import DeleteButton from "../button/deleteButton";
import { toast } from "sonner";

type DeleteDialogProps<T> = {
  rows: T | T[];
  isIcon?: boolean;
  deleteFn: (id: string | number) => Promise<any>;
  getId: (row: T) => string | number;
  isLoading: boolean;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive";
  trigger?: React.ReactNode;
};
export default function DeleteDialog<T>({
  rows,
  isIcon = false,
  deleteFn,
  getId,
  isLoading = false,
  variant = "default",
  trigger,
}: DeleteDialogProps<T>) {
  const rowsArr = Array.isArray(rows) ? rows : [rows];
  const rowCount = rowsArr.length;

  async function handleDeleteRows() {
    console.log("handleDeleteRows");
    console.log(rowsArr);
    try {
      if (rowsArr.length > 1) {
        await Promise.all(rowsArr.map((row) => deleteFn(getId(row))));
      } else {
        await deleteFn(getId(rowsArr[0]));
      }
      // Wait for all delete calls to finish
      toast.success("Selected items deleted successfully", {
        duration: 3000,
      });
      return true;
    } catch (err) {
      toast.error("Something went wrong", {
        description: "Couldn't delete selected rows",
        duration: 3000,
      });
      return false;
    }
  }
  return (
    <CustomDialog
      trigger={
        trigger ?? (
          <DeleteButton
            variant={"outline"}
            isIcon={isIcon}
            rowsCnt={rowCount}
          />
        )
      }
      title="Are you absolutely sure?"
      actionLabel="Delete"
      description={`This action cannot be undone. This will permanently delete ${rowCount} selected ${
        rowCount === 1 ? "row" : "rows"
      }.`}
      onSubmit={handleDeleteRows}
      isLoading={isLoading}
    />
  );
}
