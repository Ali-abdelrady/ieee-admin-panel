// src/app/committee/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { CommitteeType } from "@/types/committee";
import { ColumnDef } from "@tanstack/react-table";

export const committeeColumns = (
  onEdit: (row: CommitteeType) => React.ReactNode,
  onDelete: (row: CommitteeType) => React.ReactNode,
  onPreview: (row: CommitteeType) => React.ReactNode
): ColumnDef<CommitteeType>[] => [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "headId",
    header: "Head ID",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="line-clamp-2">
        {row.original.description.length > 50
          ? `${row.original.description.slice(0, 50)}...`
          : row.original.description}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<CommitteeType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Committee"
      />
    ),
  },
];
