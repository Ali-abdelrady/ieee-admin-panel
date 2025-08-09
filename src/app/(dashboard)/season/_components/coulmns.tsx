// src/app/season/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/services/helpers/dateHelpers";
import { SeasonType } from "@/types/season";
import { ColumnDef } from "@tanstack/react-table";

export const seasonColumns = (
  onEdit: (row: SeasonType) => React.ReactNode,
  onDelete: (row: SeasonType) => React.ReactNode,
  onPreview: (row: SeasonType) => React.ReactNode
): ColumnDef<SeasonType>[] => [
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
    accessorKey: "id", // matches your data key
    header: "ID",
    enableHiding: true, // allows it to be hidden
    cell: () => null,
  },
  { accessorKey: "id" },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: "board",
    header: "Board",
    cell: ({ row }) => <Badge>{row.original?.board?.length ?? 0}</Badge>,
  },
  {
    accessorKey: "events",
    header: "Events",
    cell: ({ row }) => <Badge>{row.original?.events?.length ?? 0}</Badge>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <ActionCell<SeasonType>
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
          label="Season"
        />
      );
    },
  },
];
