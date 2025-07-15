// src/app/faq/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { FAQType } from "@/types/faq";
import { ColumnDef } from "@tanstack/react-table";

export const faqColumns = (
  onEdit: (row: FAQType) => React.ReactNode,
  onDelete: (row: FAQType) => React.ReactNode,
  onPreview: (row: FAQType) => React.ReactNode
): ColumnDef<FAQType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "answer",
    header: "Answer",
    cell: ({ row }) => {
      return (
        <div className="line-clamp-2">
          {row.original.answer.length > 50
            ? `${row.original.answer.slice(0, 50)}...`
            : row.original.answer}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <ActionCell<FAQType>
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
          label="FAQ"
        />
      );
    },
  },
];
