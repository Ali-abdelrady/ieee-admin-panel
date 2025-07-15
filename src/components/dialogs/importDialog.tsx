import { ConvertXlsxToJson } from "@/lib/importUtils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { CustomDialog, CustomDialogRef } from "../forms/customModal";
import DataTable from "../table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ZodSchema } from "zod";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ImportDialogProps<T> {
  isLoading: boolean;
  addFn: (row: T) => Promise<any>;
  columns: ColumnDef<T>[];
  filterKey: string;
  disabled?: boolean;
  statue?: string;
  schema: ZodSchema;
}

export default function ImportDialog<T>({
  isLoading,
  addFn,
  columns,
  filterKey,
  disabled = false,
  statue,
  schema,
}: ImportDialogProps<T>) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<CustomDialogRef>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("No file selected");
      setLoading(false);
      return;
    }
    try {
      const file = files[0];
      const jsonArr = await ConvertXlsxToJson<T>(file);
      if (!jsonArr.length) {
        toast.error("The file is empty", {
          description: "Please upload a file with at least one row of data.",
        });
        return;
      }

      if (schema) {
        const firstRow = jsonArr[0];
        const result = schema.safeParse(firstRow);
        console.log("firstRow:", firstRow);
        if (!result.success) {
          console.error("Zod schema validation error:", result.error);

          // ✅ Optionally extract and show a nicer message in the toast
          const formattedErrors = result.error.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join("\n");
          console.log(formattedErrors);
          toast.error("Invalid file structure", {
            description: "The file fields do not match the expected format.",
          });
          return;
        }
      }

      // Optional: parse all rows if first row passed
      const parsed = schema
        ? jsonArr.map((item) => schema.parse(item)) // throws if invalid, but we trust the first row
        : jsonArr;

      setData(parsed);
      dialogRef.current?.openDialog();
    } catch (err) {
      toast.error("Something went wrong", {
        description:
          err instanceof Error ? err.message : "Couldn't import file",
      });
    } finally {
      // Reset input to allow re-selecting same file
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return false;
    try {
      // Row-based import
      await Promise.all(data.map((row) => addFn(row)));
      toast.success("Data imported successfully");

      // Reset state after successful save
      setData(null);
      return true;
    } catch (err) {
      toast.error("Failed to import");
      return false;
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx"
        ref={importInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <Button
        className="ml-auto"
        variant={isMobile ? "ghost" : "outline"}
        disabled={disabled}
        hidden={statue === "file"}
        onClick={() => importInputRef.current?.click()}
      >
        <Download className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Import Excel
      </Button>
      <CustomDialog
        title="Review Imported Data"
        description="Check your data before saving it."
        isLoading={isLoading}
        actionLabel="Save"
        onSubmit={handleSave}
        trigger={null}
        ref={dialogRef}
        isFullWidth={true}
      >
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="spinner" /> {/* Replace with your spinner */}
          </div>
        ) : (
          data && (
            <DataTable
              columns={columns.filter(
                (col) =>
                  col.id !== "actions" && col.id !== "id" && col.id !== "select"
              )}
              data={data}
              filterKey={filterKey}
              hasExportFeature={false}
              onDeleteRows={() => null}
              pageSizes={[5]}
            />
          )
        )}
      </CustomDialog>
    </>
  );
}
