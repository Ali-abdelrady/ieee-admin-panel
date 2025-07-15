// src/app/board/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { BoardType } from "@/types/board";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const boardColumns = (
  onEdit: (row: BoardType) => React.ReactNode,
  onDelete: (row: BoardType) => React.ReactNode,
  onPreview: (row: BoardType) => React.ReactNode
): ColumnDef<BoardType>[] => [
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
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "socialLinks",
    header: "Social Links",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.socialLinks?.map((link, index) => (
          <Badge key={index} variant="outline">
            {link.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<BoardType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Board Member"
      />
    ),
  },
];
